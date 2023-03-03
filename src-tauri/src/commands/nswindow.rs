use cocoa::{
    appkit::NSWindow,
    base::id,
    foundation::{NSPoint, NSRect, NSSize},
};
use tauri::{command, Window};

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
                true,
            ),
            Err(_) => {}
        }
    }
}
