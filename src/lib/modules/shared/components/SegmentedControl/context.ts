import {} from 'svelte';

export type SegmentedControlContext = {
	onChange: (value: string) => void;
	onControlTapDown: () => void;
	onControlTapUp: () => void;
};

export const CONTEXT_KEY = 'segmented_control_context';
