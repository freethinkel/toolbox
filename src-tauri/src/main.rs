#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod patch_window;
mod window_manager;

use commands::{change_window_position, get_screens, set_current_window_position};
use patch_window::PatchWindow;
use tauri::{ActivationPolicy, Manager, SystemTray, SystemTrayEvent};
use window_manager::WindowManager;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

use crate::window_manager::data::Point;

fn main() {
    let builder = tauri::Builder::default();
    let tray = SystemTray::new();

    builder
        .setup(|app| {
            app.set_activation_policy(ActivationPolicy::Accessory);
            let app = app.handle();

            let main_window = app.get_window("main").unwrap();
            let statusbar_window = app.get_window("statusbar").unwrap();
            let window_manager = WindowManager::new(app);

            window_manager.start();
            main_window.open_devtools();

            #[cfg(target_os = "macos")]
            {
                main_window.clear_decoration();
                statusbar_window.remove_title();
                apply_vibrancy(
                    &statusbar_window,
                    NSVisualEffectMaterial::Menu,
                    Some(NSVisualEffectState::Active),
                    None,
                )
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            change_window_position,
            set_current_window_position,
            get_screens
        ])
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position, size: _, ..
            } => {
                app.emit_all(
                    "on_statusbar_click",
                    &Point {
                        x: position.x,
                        y: position.y,
                    },
                );
            }
            _ => {}
        })
        .system_tray(tray)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
