import {} from 'svelte';

export type SegmentedControlContext = {
	onChange: (value: string) => void;
	onControlTapDown: (value: string) => void;
	onControlTapUp: (value: string) => void;
};

export const CONTEXT_KEY = 'segmented_control_context';
