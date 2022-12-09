#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod patch_window;
mod window_manager;

use patch_window::PatchWindow;
use tauri::{command, Manager};
use window_manager::WindowManager;

#[command]
async fn change_window_position(payload: String) {
    let parsed = serde_json::from_str(payload.as_str());
    match parsed {
        Ok(data) => {
            WindowManager::set_window_position(data);
        }
        Err(_) => {}
    }
}

fn main() {
    let builder = tauri::Builder::default();

    builder
        .setup(|app| {
            let app = app.handle();
            let main_window = app.get_window("main").unwrap();

            let window_manager = WindowManager::new(app);
            window_manager.start();

            #[cfg(target_os = "macos")]
            {
                main_window.clear_decoration();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![change_window_position])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
