use tauri::Manager;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::window::Color;
use tauri::Emitter;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // Ensure the webview background is transparent
            window
                .set_background_color(Some(Color(0, 0, 0, 0)))
                .ok();

            // System tray menu
            let show = MenuItem::with_id(app, "show", "Show Buddy", true, None::<&str>)?;
            let hide = MenuItem::with_id(app, "hide", "Hide Buddy", true, None::<&str>)?;
            let toggle_style = MenuItem::with_id(app, "toggle_style", "Toggle Pixel/ASCII", true, None::<&str>)?;
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
                        app.emit("toggle-style", ()).ok();
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
