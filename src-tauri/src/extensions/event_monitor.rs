use block::{ConcreteBlock, RcBlock};
use cocoa::{
    appkit::{CGPoint, NSEvent, NSEventMask, NSEventType},
    base::{id, nil, BOOL},
    foundation::{NSPoint, NSRect},
};
use objc::{class, msg_send, sel, sel_impl};

#[repr(C)]
pub struct __CGEvent;

pub type CGEventRef = *const __CGEvent;

#[derive(Clone)]
pub struct EventMonitor {
    monitor_id: id,
}

impl EventMonitor {
    pub fn location(event: id) -> CGPoint {
        unsafe {
            let cg = event.CGEvent() as *const __CGEvent;

            CGEventGetLocation(cg)
        }
    }

    pub fn event_type(event: id) -> NSEventType {
        unsafe { event.eventType() }
    }

    pub fn stop(&self) {
        unsafe {
            let () = msg_send![class!(NSEvent), removeMonitor: self.monitor_id];
        }
    }

    pub fn global_monitor<F>(mask: NSEventMask, handler: F) -> Self
    where
        F: Fn(id) -> Option<id> + Send + Sync + 'static,
    {
        let block = move |event: id| handler(event);
        let block = ConcreteBlock::new(block);
        let block = block.copy();

        unsafe {
            let monitor: id = msg_send![class!(NSEvent), addGlobalMonitorForEventsMatchingMask:mask handler:&*block];

            EventMonitor {
                monitor_id: monitor,
            }
        }
    }
}

#[link(name = "ApplicationServices", kind = "framework")]
extern "C" {
    fn CGEventGetLocation(event: CGEventRef) -> CGPoint;
}

extern "C" {
    pub fn NSMouseInRect(aPoint: NSPoint, aRect: NSRect, flipped: BOOL) -> BOOL;
}
