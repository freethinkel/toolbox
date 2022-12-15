#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod patch_window;
mod window_manager;

use commands::{change_window_position, get_screens};
use patch_window::PatchWindow;
use tauri::{ActivationPolicy, Manager, SystemTray, SystemTrayEvent};
use tauri_plugin_fs_watch::Watcher;
use window_manager::WindowManager;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

use crate::{
    commands::{
        send_message, set_current_window_position, start_window_manager, stop_window_manager,
    },
    window_manager::data::Point,
};

fn main() {
    let builder = tauri::Builder::default();
    let tray = SystemTray::new();
    WindowManager::check_permission();

    builder
        .setup(|app| {
            app.set_activation_policy(ActivationPolicy::Accessory);
            let app = app.handle();

            let main_window = app.get_window("main").unwrap();
            let statusbar_window = app.get_window("statusbar").unwrap();

            // main_window.open_devtools();

            #[cfg(target_os = "macos")]
            {
                main_window.setup_overlay();
                statusbar_window.setup_statusbar();
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
        .plugin(Watcher::default())
        .invoke_handler(tauri::generate_handler![
            change_window_position,
            start_window_manager,
            stop_window_manager,
            set_current_window_position,
            get_screens,
            send_message
        ])
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position, size: _, ..
            } => {
                if let Ok(_) = app.emit_all(
                    "on_statusbar_click",
                    &Point {
                        x: position.x,
                        y: position.y,
                    },
                ) {}
            }
            _ => {}
        })
        .system_tray(tray)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
