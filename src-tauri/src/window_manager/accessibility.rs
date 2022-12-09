// use super::core_graphics_patch::CGRectMakeWithDictionaryRepresentation;
// use super::window_position::FromCgRect;
// use crate::common::{
//     active_window::ActiveWindow, platform_api::PlatformApi, window_position::WindowPosition,
// };
// use appkit_nsworkspace_bindings::{INSRunningApplication, INSWorkspace, NSWorkspace};
use core_foundation::{
    array::{CFArray, CFArrayGetCount, CFArrayGetValueAtIndex, __CFArray},
    base::{CFGetTypeID, ToVoid},
    boolean::CFBooleanGetTypeID,
    dictionary::{CFDictionaryGetTypeID, CFDictionaryGetValueIfPresent, __CFDictionary},
    mach_port::CFTypeID,
    number::{
        CFBooleanGetValue, CFNumberGetType, CFNumberGetTypeID, CFNumberGetValue, CFNumberRef,
        CFNumberType,
    },
    string::{CFString, CFStringGetTypeID},
};
use core_graphics::{
    display::kCGWindowListExcludeDesktopElements,
    window::{
        kCGNullWindowID, kCGWindowListOptionOnScreenOnly, CGWindowListCopyWindowInfo,
        CGWindowListOption,
    },
};
// use core_graphics::display::*;
use cocoa::quartzcore::transaction::set_value_for_key;
use objc::{msg_send, runtime::Object, sel, sel_impl};
use rust_macios::core_graphics::CGRect;
use std::ffi::c_void;

#[allow(non_upper_case_globals)]
pub const kCFNumberSInt32Type: CFNumberType = 3;
#[allow(non_upper_case_globals)]
pub const kCFNumberSInt64Type: CFNumberType = 4;

// #[derive(Debug)]
// enum DictEntryValue {
//     _Number(i64),
//     _Bool(bool),
//     _String(String),
//     _Rect(WindowPosition),
//     _Unknown,
// }

pub struct MacPlatformApi {}

#[derive(Debug)]
enum DictEntryValue {
    _Number(i64),
    _Bool(bool),
    _String(String),
    _Unknown,
}

type CFDictionaryRef = *const __CFDictionary;

pub fn get_window(pid: i64, id: String) -> Result<i64, ()> {
    const OPTIONS: CGWindowListOption =
        kCGWindowListOptionOnScreenOnly | kCGWindowListExcludeDesktopElements;
    let window_list_info = unsafe { CGWindowListCopyWindowInfo(OPTIONS, kCGNullWindowID) };

    let windows_count: isize = unsafe { CFArrayGetCount(window_list_info) };
    for i in 0..windows_count {
        let dic_ref = unsafe { CFArrayGetValueAtIndex(window_list_info, i) as CFDictionaryRef };

        if dic_ref.is_null() {
            continue;
        }

        let window_pid = get_from_dict(dic_ref, "kCGWindowOwnerPID");

        if let DictEntryValue::_Number(win_pid) = window_pid {
            if win_pid != pid {
                continue;
            }
            if let DictEntryValue::_Number(window_id) = get_from_dict(dic_ref, "kCGWindowNumber") {
                if (window_id.to_string() == id) {
                    return Ok(window_id);
                }
            }
        }
    }

    println!("window_count {:?}", windows_count);

    return Err(());
}

// Taken from https://github.com/sassman/t-rec-rs/blob/v0.7.0/src/macos/window_id.rs#L73
// Modified to support dictionary type id for kCGWindowBounds
fn get_from_dict(dict: CFDictionaryRef, key: &str) -> DictEntryValue {
    let cf_key: CFString = key.into();
    let mut value: *const c_void = std::ptr::null();
    if unsafe { CFDictionaryGetValueIfPresent(dict, cf_key.to_void(), &mut value) } != 0 {
        let type_id: CFTypeID = unsafe { CFGetTypeID(value) };
        if type_id == unsafe { CFNumberGetTypeID() } {
            let value = value as CFNumberRef;

            #[allow(non_upper_case_globals)]
            match unsafe { CFNumberGetType(value) } {
                kCFNumberSInt64Type => {
                    let mut value_i64 = 0_i64;
                    let out_value: *mut i64 = &mut value_i64;
                    let converted =
                        unsafe { CFNumberGetValue(value, kCFNumberSInt64Type, out_value.cast()) };
                    if converted {
                        return DictEntryValue::_Number(value_i64);
                    }
                }
                kCFNumberSInt32Type => {
                    let mut value_i32 = 0_i32;
                    let out_value: *mut i32 = &mut value_i32;
                    let converted =
                        unsafe { CFNumberGetValue(value, kCFNumberSInt32Type, out_value.cast()) };
                    if converted {
                        return DictEntryValue::_Number(value_i32 as i64);
                    }
                }
                n => {
                    eprintln!("Unsupported Number of typeId: {}", n);
                }
            }
        } else if type_id == unsafe { CFBooleanGetTypeID() } {
            return DictEntryValue::_Bool(unsafe { CFBooleanGetValue(value.cast()) });
        } else if type_id == unsafe { CFStringGetTypeID() } {
            let str = nsstring_to_rust_string(value as *mut Object);
            return DictEntryValue::_String(str);
        } else if type_id == unsafe { CFDictionaryGetTypeID() } && key == "kCGWindowBounds" {
            // let rect: CGRect = unsafe {
            //     let mut rect = std::mem::zeroed();
            //     CGRectMakeWithDictionaryRepresentation(value.cast(), &mut rect);
            //     rect
            // };

            // return DictEntryValue::_Rect(WindowPosition::from_cg_rect(&rect));
        } else {
            eprintln!("Unexpected type: {}", type_id);
        }
    }

    DictEntryValue::_Unknown
}

pub fn nsstring_to_rust_string(nsstring: *mut Object) -> String {
    unsafe {
        let cstr: *const i8 = msg_send![nsstring, UTF8String];
        if cstr != std::ptr::null() {
            std::ffi::CStr::from_ptr(cstr)
                .to_string_lossy()
                .into_owned()
        } else {
            "".into()
        }
    }
}
