use tauri::Manager;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::window::Color;
use tauri::Emitter;

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

#[tauri::command]
fn get_buddy_config() -> Result<BuddyConfig, String> {
    let home = dirs::home_dir().ok_or("No home directory")?;

    // Read name from ~/.claude.json
    let claude_config_path = home.join(".claude.json");
    let name = std::fs::read_to_string(&claude_config_path)
        .ok()
        .and_then(|s| serde_json::from_str::<serde_json::Value>(&s).ok())
        .and_then(|v| {
            v.get("companion")
                .and_then(|c| c.get("name"))
                .and_then(|n| n.as_str())
                .map(String::from)
        })
        .unwrap_or_else(|| "Buddy".to_string());

    // Read species/eye/hat/rarity from any-buddy config (if it exists)
    let anybuddy_path = home.join(".claude-code-any-buddy.json");
    if let Ok(content) = std::fs::read_to_string(&anybuddy_path) {
        if let Ok(val) = serde_json::from_str::<serde_json::Value>(&content) {
            return Ok(BuddyConfig {
                species: val["species"].as_str().unwrap_or("capybara").to_string(),
                eye: val["eye"].as_str().unwrap_or("·").to_string(),
                hat: val["hat"].as_str().unwrap_or("none").to_string(),
                rarity: val["rarity"].as_str().unwrap_or("common").to_string(),
                shiny: val["shiny"].as_bool().unwrap_or(false),
                name,
            });
        }
    }

    // Fallback: try to generate via bun with default salt
    let claude_config = std::fs::read_to_string(&claude_config_path)
        .ok()
        .and_then(|s| serde_json::from_str::<serde_json::Value>(&s).ok());

    let user_id = claude_config
        .as_ref()
        .and_then(|v| {
            v.get("userId")
                .or_else(|| v.get("oauthAccount").and_then(|a| a.get("userID")))
                .and_then(|v| v.as_str())
        })
        .unwrap_or("unknown");

    let bun_script = format!(
        r#"const RARITIES=['common','uncommon','rare','epic','legendary'];const RARITY_WEIGHTS={{common:60,uncommon:25,rare:10,epic:4,legendary:1}};const SPECIES=['duck','goose','blob','cat','dragon','octopus','owl','penguin','turtle','snail','ghost','axolotl','capybara','cactus','robot','rabbit','mushroom','chonk'];const EYES=['·','✦','×','◉','@','°'];const HATS=['none','crown','tophat','propeller','halo','wizard','beanie','tinyduck'];function m(s){{let a=s>>>0;return function(){{a|=0;a=(a+0x6d2b79f5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}}};function p(r,a){{return a[Math.floor(r()*a.length)]}};const k='{}friend-2026-401';const h=Number(BigInt(Bun.hash(k))&0xffffffffn);const r=m(h);const total=100;let roll=r()*total;let rarity='common';for(const x of RARITIES){{roll-=RARITY_WEIGHTS[x];if(roll<0){{rarity=x;break}}}};const species=p(r,SPECIES);const eye=p(r,EYES);const hat=rarity==='common'?'none':p(r,HATS);const shiny=r()<0.01;console.log(JSON.stringify({{species,eye,hat,rarity,shiny}}))"#,
        user_id
    );

    if let Ok(out) = std::process::Command::new("bun")
        .args(["-e", &bun_script])
        .output()
    {
        if out.status.success() {
            let stdout = String::from_utf8_lossy(&out.stdout);
            if let Ok(val) = serde_json::from_str::<serde_json::Value>(stdout.trim()) {
                return Ok(BuddyConfig {
                    species: val["species"].as_str().unwrap_or("capybara").to_string(),
                    eye: val["eye"].as_str().unwrap_or("·").to_string(),
                    hat: val["hat"].as_str().unwrap_or("none").to_string(),
                    rarity: val["rarity"].as_str().unwrap_or("common").to_string(),
                    shiny: val["shiny"].as_bool().unwrap_or(false),
                    name,
                });
            }
        }
    }

    Ok(BuddyConfig {
        species: "capybara".to_string(),
        eye: "·".to_string(),
        hat: "none".to_string(),
        rarity: "common".to_string(),
        shiny: false,
        name,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_buddy_config])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window
                .set_background_color(Some(Color(0, 0, 0, 0)))
                .ok();

            let show = MenuItem::with_id(app, "show", "Show Buddy", true, None::<&str>)?;
            let hide = MenuItem::with_id(app, "hide", "Hide Buddy", true, None::<&str>)?;
            let toggle_style =
                MenuItem::with_id(app, "toggle_style", "Toggle Pixel/ASCII", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show, &hide, &toggle_style, &quit])?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
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
