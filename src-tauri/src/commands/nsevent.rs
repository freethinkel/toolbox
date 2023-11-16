use nanoid::nanoid;

use crate::data::{frame::Point, mouse::MouseEvent};
use crate::extensions::event_monitor::EventMonitor;

use cocoa::{
    appkit::{NSEvent, NSEventMask},
    base::nil,
};
use tauri::{command, Window};

struct MonitorListeners {
    id: String,
    monitor: Option<EventMonitor>,
}

static mut GLOBAL_MONITORS: Vec<MonitorListeners> = vec![];

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
pub fn nsevent_remove_monitor(id: String) {
    unsafe {
        let monitor_manager = GLOBAL_MONITORS
            .iter()
            .enumerate()
            .find(|el| el.1.id == id.clone());

        match monitor_manager {
            Some((index, listener)) => match &listener.monitor {
                Some(monitor) => {
                    monitor.stop();
                    GLOBAL_MONITORS.remove(index);
                }
                None => (),
            },
            _ => (),
        }
    }
}

#[command]
pub fn nsevent_add_global_monitor_for_events(mask: u64, window: Window) -> String {
    let instance_id = nanoid!();
    nsevent_remove_monitor(instance_id.clone());
    let mask = NSEventMask::from_bits(mask);
    let cloned_id = instance_id.clone();
    let monitor = EventMonitor::global_monitor(mask.unwrap(), move |event| {
        let position = EventMonitor::location(event);
        let event_type = EventMonitor::event_type(event);
        let payload = MouseEvent {
            point: Point {
                x: position.x,
                y: position.y,
            },
            monitor_id: cloned_id.clone(),
            event_type: event_type as u64,
        };
        let _ = window.emit("nsevent_on_event", payload);
        None
    });

    unsafe {
        GLOBAL_MONITORS.push(MonitorListeners {
            id: instance_id.clone(),
            monitor: Some(monitor),
        });
    }
    return instance_id;
}
