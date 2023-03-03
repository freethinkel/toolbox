use super::frame::Frame;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Screen {
    pub visible_frame: Frame,
    pub frame: Frame,
}
