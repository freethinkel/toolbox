use crate::data::{frame::Point, mouse::MouseEvent};
use crate::extensions::event_monitor::EventMonitor;

use cocoa::{
    appkit::{NSEvent, NSEventMask},
    base::nil,
};
use tauri::{command, Window};
static mut MONITOR_GLOBAL: Option<EventMonitor> = None;

#[command]
pub fn nsevent_mouse_location() -> Option<Point> {
    unsafe {
        let mouse_location = NSEvent::mouseLocation(nil);

        Some(Point {
            x: mouse_location.x,
            y: mouse_location.y,
        })
    }
}

#[command]
pub fn nsevent_remove_monitor() {
    unsafe {
        let monitor_manager = &MONITOR_GLOBAL;
        match monitor_manager {
            Some(monitor) => monitor.stop(),
            _ => (),
        }
    }
}

#[command]
pub fn nsevent_add_global_monitor_for_events(mask: u64, window: Window) {
    nsevent_remove_monitor();
    let mask = NSEventMask::from_bits(mask);
    let monitor = EventMonitor::global_monitor(mask.unwrap(), move |event| {
        let position = EventMonitor::location(event);
        let event_type = EventMonitor::event_type(event);
        let payload = MouseEvent {
            point: Point {
                x: position.x,
                y: position.y,
            },
            event_type: event_type as u64,
        };
        let _ = window.emit("nsevent_on_event", payload);
        None
    });
    unsafe {
        MONITOR_GLOBAL = Some(monitor);
    }
}
