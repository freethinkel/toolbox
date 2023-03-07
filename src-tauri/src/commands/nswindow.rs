use cocoa::{
    appkit::{NSColor, NSWindow, NSWindowStyleMask},
    base::{id, nil, YES},
    foundation::{NSPoint, NSRect, NSSize},
};
use tauri::{command, AppHandle, Manager, Window};
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

use crate::data::frame::Frame;

#[command]
pub fn nswindow_set_frame(window: Window, frame: Frame) {
    unsafe {
        let ns_window = window.ns_window();
        match ns_window {
            Ok(ns_window) => (ns_window as id).setFrame_display_(
                NSRect {
                    origin: NSPoint {
                        x: frame.position.x,
                        y: frame.position.y,
                    },
                    size: NSSize {
                        width: frame.size.width,
                        height: frame.size.height,
                    },
                },
                YES,
            ),
            Err(_) => {}
        }
    }
}

#[command]
pub fn nswindow_set_decorations(app: AppHandle, label: String) {
    unsafe {
        let window = app.get_window(&label);

        match window {
            Some(window) => {
                let ns_window = window.ns_window().unwrap() as id;
                ns_window.setStyleMask_(
                    ns_window.styleMask() | NSWindowStyleMask::NSFullSizeContentViewWindowMask,
                );

                let _ = apply_vibrancy(
                    &window,
                    NSVisualEffectMaterial::HudWindow,
                    Some(NSVisualEffectState::Active),
                    None,
                );
                let color =
                    NSColor::colorWithSRGBRed_green_blue_alpha_(nil, 255.0, 255.0, 255.0, 1.0);
                ns_window.setBackgroundColor_(color);
            }
            None => {}
        }
    }
}
