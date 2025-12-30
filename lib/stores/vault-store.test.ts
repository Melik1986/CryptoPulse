import { act } from '@testing-library/react';
import { useVaultStore } from './vault-store';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useVaultStore', () => {
  beforeEach(() => {
    const { reset } = useVaultStore.getState();
    reset();
  });

  it('should have initial state', () => {
    const { vaultOffset, mouse, scrollProgress, isAnimating } = useVaultStore.getState();
    expect(vaultOffset).toBe(0);
    expect(mouse).toEqual({ x: 0, y: 0 });
    expect(scrollProgress).toBe(0);
    expect(isAnimating).toBe(false);
  });

  it('should set mouse position', () => {
    const { setMouse } = useVaultStore.getState();

    act(() => {
      setMouse(0.5, -0.5);
    });

    const { mouse } = useVaultStore.getState();
    expect(mouse).toEqual({ x: 0.5, y: -0.5 });
  });

  it('should clamp mouse position', () => {
    const { setMouse } = useVaultStore.getState();

    act(() => {
      setMouse(2, -2);
    });

    const { mouse } = useVaultStore.getState();
    expect(mouse).toEqual({ x: 1, y: -1 });
  });

  it('should set scroll progress and update vaultOffset', () => {
    const { setScrollProgress } = useVaultStore.getState();

    act(() => {
      setScrollProgress(0.5);
    });

    const { scrollProgress, vaultOffset, isAnimating } = useVaultStore.getState();
    expect(scrollProgress).toBe(0.5);
    expect(vaultOffset).toBe(0.5);
    expect(isAnimating).toBe(true);
  });

  it('should clamp scroll progress', () => {
    const { setScrollProgress } = useVaultStore.getState();

    act(() => {
      setScrollProgress(1.5);
    });

    const { scrollProgress, vaultOffset } = useVaultStore.getState();
    expect(scrollProgress).toBe(1);
    expect(vaultOffset).toBe(1);
  });
});
