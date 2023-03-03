import type { Frame } from '@/modules/shared/models/frame';
import { WindowManagerStore } from '@/modules/window-manager';
import { createStore, forward } from 'effector';

export const $placeholder = createStore<Frame>(null);
