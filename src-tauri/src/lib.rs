use tauri::Manager;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::window::Color;
use tauri::Emitter;
use tauri::image::Image;

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
struct BuddyConfig {
    species: String,
    eye: String,
    hat: String,
    rarity: String,
    shiny: bool,
    name: String,
}

fn load_buddy_config() -> BuddyConfig {
    let home = match dirs::home_dir() {
        Some(h) => h,
        None => return default_config(),
    };

    let name = std::fs::read_to_string(home.join(".claude.json"))
        .ok()
        .and_then(|s| serde_json::from_str::<serde_json::Value>(&s).ok())
        .and_then(|v| {
            v.get("companion")
                .and_then(|c| c.get("name"))
                .and_then(|n| n.as_str())
                .map(String::from)
        })
        .unwrap_or_else(|| "Buddy".to_string());

    // Try any-buddy config first
    if let Ok(content) = std::fs::read_to_string(home.join(".claude-code-any-buddy.json")) {
        if let Ok(val) = serde_json::from_str::<serde_json::Value>(&content) {
            return BuddyConfig {
                species: val["species"].as_str().unwrap_or("capybara").to_string(),
                eye: val["eye"].as_str().unwrap_or("·").to_string(),
                hat: val["hat"].as_str().unwrap_or("none").to_string(),
                rarity: val["rarity"].as_str().unwrap_or("common").to_string(),
                shiny: val["shiny"].as_bool().unwrap_or(false),
                name,
            };
        }
    }

    // Try bun generation
    let user_id = std::fs::read_to_string(home.join(".claude.json"))
        .ok()
        .and_then(|s| serde_json::from_str::<serde_json::Value>(&s).ok())
        .and_then(|v| {
            v.get("userId")
                .or_else(|| v.get("oauthAccount").and_then(|a| a.get("userID")))
                .and_then(|v| v.as_str())
                .map(String::from)
        })
        .unwrap_or_else(|| "unknown".to_string());

    let bun_script = format!(
        r#"const R=['common','uncommon','rare','epic','legendary'];const W={{common:60,uncommon:25,rare:10,epic:4,legendary:1}};const S=['duck','goose','blob','cat','dragon','octopus','owl','penguin','turtle','snail','ghost','axolotl','capybara','cactus','robot','rabbit','mushroom','chonk'];const E=['·','✦','×','◉','@','°'];const H=['none','crown','tophat','propeller','halo','wizard','beanie','tinyduck'];function m(s){{let a=s>>>0;return function(){{a|=0;a=(a+0x6d2b79f5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}}};function p(r,a){{return a[Math.floor(r()*a.length)]}};const k='{}friend-2026-401';const h=Number(BigInt(Bun.hash(k))&0xffffffffn);const r=m(h);let roll=r()*100;let rarity='common';for(const x of R){{roll-=W[x];if(roll<0){{rarity=x;break}}}};console.log(JSON.stringify({{species:p(r,S),eye:p(r,E),hat:rarity==='common'?'none':p(r,H),rarity,shiny:r()<0.01}}))"#,
        user_id
    );

    if let Ok(out) = std::process::Command::new("bun").args(["-e", &bun_script]).output() {
        if out.status.success() {
            let stdout = String::from_utf8_lossy(&out.stdout);
            if let Ok(val) = serde_json::from_str::<serde_json::Value>(stdout.trim()) {
                return BuddyConfig {
                    species: val["species"].as_str().unwrap_or("capybara").to_string(),
                    eye: val["eye"].as_str().unwrap_or("·").to_string(),
                    hat: val["hat"].as_str().unwrap_or("none").to_string(),
                    rarity: val["rarity"].as_str().unwrap_or("common").to_string(),
                    shiny: val["shiny"].as_bool().unwrap_or(false),
                    name,
                };
            }
        }
    }

    BuddyConfig { name, ..default_config() }
}

fn default_config() -> BuddyConfig {
    BuddyConfig {
        species: "capybara".to_string(),
        eye: "·".to_string(),
        hat: "none".to_string(),
        rarity: "common".to_string(),
        shiny: false,
        name: "Buddy".to_string(),
    }
}

#[tauri::command]
fn get_buddy_config() -> Result<BuddyConfig, String> {
    Ok(load_buddy_config())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_buddy_config])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_background_color(Some(Color(0, 0, 0, 0))).ok();

            // Load species-specific tray icon
            let config = load_buddy_config();

            // Try resource path (production) then dev path
            let resource_path = app.path()
                .resolve(format!("tray/{}.png", config.species), tauri::path::BaseDirectory::Resource)
                .ok();

            let dev_path = std::env::current_dir()
                .ok()
                .map(|d| d.join(format!("../public/tray/{}.png", config.species)));

            let icon_path = resource_path
                .filter(|p| p.exists())
                .or_else(|| dev_path.filter(|p| p.exists()));

            let icon = match icon_path {
                Some(path) => {
                    eprintln!("[buddy] Loading tray icon from: {:?}", path);
                    Image::from_path(&path).unwrap_or_else(|e| {
                        eprintln!("[buddy] Failed to load tray icon: {}", e);
                        app.default_window_icon().unwrap().clone()
                    })
                }
                None => {
                    eprintln!("[buddy] No tray icon found for species: {}", config.species);
                    app.default_window_icon().unwrap().clone()
                }
            };

            let show = MenuItem::with_id(app, "show", &format!("Show {}", config.name), true, None::<&str>)?;
            let hide = MenuItem::with_id(app, "hide", &format!("Hide {}", config.name), true, None::<&str>)?;
            let toggle_style = MenuItem::with_id(app, "toggle_style", "Toggle Pixel/ASCII", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show, &hide, &toggle_style, &quit])?;

            TrayIconBuilder::new()
                .icon(icon)
                .tooltip(&config.name)
                .menu(&menu)
                .show_menu_on_left_click(true)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(w) = app.get_webview_window("main") {
                            w.show().ok();
                            w.set_focus().ok();
                        }
                    }
                    "hide" => {
                        if let Some(w) = app.get_webview_window("main") {
                            w.hide().ok();
                        }
                    }
                    "toggle_style" => {
                        if let Some(w) = app.get_webview_window("main") {
                            w.emit("toggle-style", ()).ok();
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running buddy");
}
