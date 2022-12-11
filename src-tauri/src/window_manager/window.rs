use std::{ffi::c_void, ptr};

use accessibility_sys::{
    kAXErrorSuccess, kAXPositionAttribute, kAXSizeAttribute, kAXValueTypeCGPoint,
    kAXValueTypeCGSize, kAXWindowsAttribute, AXError, AXUIElementCopyAttributeValue,
    AXUIElementCreateApplication, AXUIElementRef, AXUIElementSetAttributeValue, AXValueCreate,
};
use cocoa::{base::id, foundation::NSArray};
use core_foundation::{
    base::{CFTypeRef, TCFType},
    string::CFString,
};
use core_graphics::{
    display::{CGPoint, CGRect, CGSize},
    window::CGWindowID,
};

pub struct WindowElement {}

impl WindowElement {
    pub fn set_frame(window: AXUIElementRef, rect: CGRect) {
        WindowElement::set_position(window, rect.origin);
        WindowElement::set_size(window, rect.size);
    }

    pub fn set_position(window: AXUIElementRef, mut point: CGPoint) {
        let ptr = &mut point as *mut _ as *mut c_void;
        unsafe {
            AXUIElementSetAttributeValue(
                window,
                CFString::new(kAXPositionAttribute).as_concrete_TypeRef(),
                AXValueCreate(kAXValueTypeCGPoint, ptr).cast(),
            );
        }
    }
    pub fn set_size(window: AXUIElementRef, mut size: CGSize) {
        let ptr = &mut size as *mut _ as *mut c_void;
        unsafe {
            AXUIElementSetAttributeValue(
                window,
                CFString::new(kAXSizeAttribute).as_concrete_TypeRef(),
                AXValueCreate(kAXValueTypeCGSize, ptr).cast(),
            );
        }
    }

    pub fn get_window_from_id(pid: i32, id: String) -> Result<AXUIElementRef, ()> {
        let window_owner = unsafe { AXUIElementCreateApplication(pid) };
        let mut windows_ref: CFTypeRef = ptr::null();
        if unsafe {
            let x = AXUIElementCopyAttributeValue(
                window_owner,
                CFString::new(kAXWindowsAttribute).as_concrete_TypeRef(),
                &mut windows_ref as *mut CFTypeRef,
            );
            x
        } != kAXErrorSuccess
        {
            return Err(());
        }

        if windows_ref.is_null() {
            return Err(());
        }

        let applications_windows_nsarray = windows_ref as id;

        let target_window_ax = {
            let count = unsafe { NSArray::count(applications_windows_nsarray) };
            let mut window_ax_option: Option<id> = None;
            for i in 0..count {
                let window_ax = unsafe { NSArray::objectAtIndex(applications_windows_nsarray, i) };

                let window_id = {
                    let mut window_id: CGWindowID = 0;
                    if unsafe { _AXUIElementGetWindow(window_ax as AXUIElementRef, &mut window_id) }
                        != kAXErrorSuccess
                    {
                        continue;
                    }
                    window_id
                };

                if window_id.to_string() == id {
                    window_ax_option = Some(window_ax);
                }
            }
            window_ax_option
        }
        .ok_or(())? as AXUIElementRef;

        return Ok(target_window_ax);
    }
}

extern "C" {
    fn _AXUIElementGetWindow(element: AXUIElementRef, window_id: *mut CGWindowID) -> AXError;
}
