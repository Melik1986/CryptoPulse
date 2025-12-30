import { renderHook, act } from '@testing-library/react';
import { useVaultScroll } from './useVaultScroll';
import { useVaultStore } from '../lib/stores/vault-store';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useVaultScroll', () => {
  beforeEach(() => {
    useVaultStore.getState().reset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should update scroll progress on scroll event', () => {
    renderHook(() => useVaultScroll());

    // Mock window properties
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    const { scrollProgress } = useVaultStore.getState();
    expect(scrollProgress).toBe(0.5);
  });

  it('should clamp scroll progress to 0 and 1', () => {
    renderHook(() => useVaultScroll());

    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

    // Test upper bound
    Object.defineProperty(window, 'scrollY', { value: 1500, writable: true });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(useVaultStore.getState().scrollProgress).toBe(1);

    // Test lower bound
    Object.defineProperty(window, 'scrollY', { value: -100, writable: true });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(useVaultStore.getState().scrollProgress).toBe(0);
  });
});
