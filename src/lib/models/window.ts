export type Size = {
	width: number;
	height: number;
};

export type Position = {
	x: number;
	y: number;
};

export type WindowInfo = {
	id: string;
	pid: number;
	size: Size;
	position: Position;
};

export type Frame = {
	size: Size;
	position: Position;
};

export type Screen = {
	frame: Frame;
	visible_frame: Frame;
	cocoa: {
		frame: Frame;
		visible_frame: Frame;
	};
};
