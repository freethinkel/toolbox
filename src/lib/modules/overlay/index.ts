import Setup from './view/Setup.svelte';

export const init = (target: HTMLElement): void => {
  new Setup({
    target,
  });
};
