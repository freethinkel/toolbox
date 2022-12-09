import type { Position } from './window';

export type ChannelMouseWindowInfo = {
	id: string;
	pid: number;
	point: Position;
};

export type ChannelMouseEvent = {
	event_type: 'dragging' | 'mouse_up' | 'mouse_down';
	window_info: ChannelMouseWindowInfo;
	point: Position;
};
