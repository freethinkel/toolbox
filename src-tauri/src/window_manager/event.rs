use block::ConcreteBlock;
use cocoa::{
    appkit::{CGPoint, NSEvent, NSEventMask, NSEventType},
    base::id,
};
use objc::{class, msg_send, sel, sel_impl};

#[repr(C)]
pub struct __CGEvent;

pub type CGEventRef = *const __CGEvent;

#[derive(Debug)]
pub struct EventMonitor(pub id);

/// A wrapper over an `NSEvent`.
#[derive(Debug)]
pub struct Event(pub id);

impl Event {
    pub fn location(event: id) -> CGPoint {
        unsafe {
            let cg = event.CGEvent() as *const __CGEvent;

            CGEventGetLocation(cg)
        }
    }

    pub fn event_type(event: id) -> NSEventType {
        unsafe { event.eventType() }
    }

    pub fn global_monitor<F>(mask: NSEventMask, handler: F)
    where
        F: Fn(id) -> Option<id> + Send + Sync + 'static,
    {
        let block = move |event: id| handler(event);
        let block = ConcreteBlock::new(block);
        let block = block.copy();

        unsafe {
            let monitor: id = msg_send![class!(NSEvent), addGlobalMonitorForEventsMatchingMask:mask handler:&*block];
        }
    }
}

#[link(name = "ApplicationServices", kind = "framework")]
extern "C" {
    fn CGEventGetLocation(event: CGEventRef) -> CGPoint;
}
