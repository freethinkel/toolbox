use std::{any::type_name, fmt::format, ops::Mul};

use cocoa::{
    appkit::{NSColor, NSColorSpace},
    base::{id, nil},
    foundation::NSString,
};
use objc::{class, msg_send, sel, sel_impl};

pub fn playground() {
    unsafe {
        // msg_send!();
        // let raw_color = NSAColor::accentColor(nil);
        // let color = NSAColor::toHexString(raw_color);
        // let color = "";
        // println!("{:?}", color);
    }
}
