#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod patch_window;
mod window_manager;

use commands::{change_window_position, get_screens, set_current_window_position};
use patch_window::PatchWindow;
use tauri::Manager;
use window_manager::WindowManager;

fn main() {
    let builder = tauri::Builder::default();

    builder
        .setup(|app| {
            let app = app.handle();
            let main_window = app.get_window("main").unwrap();

            let window_manager = WindowManager::new(app);
            window_manager.start();
            main_window.open_devtools();

            #[cfg(target_os = "macos")]
            {
                main_window.clear_decoration();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            change_window_position,
            set_current_window_position,
            get_screens
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
