use std::{any::type_name, fmt::format, ops::Mul};

use cocoa::{
    appkit::{NSColor, NSColorSpace},
    base::{id, nil},
    foundation::NSString,
};
use objc::{class, msg_send, sel, sel_impl};

pub fn playground() {
    unsafe {
        let notification_center: id =
            msg_send![class!(NSDistributedNotificationCenter), defaultCenter];
        let notification_name = ("AppleColorPreferencesChangedNotification");
        let this: Option<()> = None;
        // let _: id = msg_send![
        //     notification_center,
        //     addObserver: this
        //     selector: sel!(onUpdateAccentColor:)
        //     name: &*notification_name
        //     object: nil
        // ];

        // println!("not: {:?}", center);
        // [center addObserver:self
        //         selector:@selector(notificationEvent:)
        //             name:key
        //           object:nil];
        // msg_send!();
        // let raw_color = NSAColor::accentColor(nil);
        // let color = NSAColor::toHexString(raw_color);
        // let color = "";
        // println!("{:?}", color);
    }
}
