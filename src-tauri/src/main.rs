#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod patch_window;
mod window_manager;

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

            #[cfg(target_os = "macos")]
            {
                main_window.clear_decoration();
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
