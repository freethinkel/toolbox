use cocoa::{
    appkit::{NSColor, NSColorSpace},
    base::{id, nil},
};
use objc::{class, msg_send, sel, sel_impl};

pub trait NSAColor: Sized {
    unsafe fn accentColor(_: Self) -> String;
}

impl NSAColor for id {
    unsafe fn accentColor(_: Self) -> String {
        unsafe {
            let color: id = msg_send![class!(NSColor), controlAccentColor];
            let color =
                NSColor::colorUsingColorSpace_(color, NSColorSpace::deviceRGBColorSpace(nil));
            let r = (color.redComponent() * (0xFF as f64)).round();
            let g = (color.greenComponent() * (0xFF as f64)).round();
            let b = (color.blueComponent() * (0xFF as f64)).round();

            return format!("rgb({}, {}, {})", r, g, b);
        }
    }
}
