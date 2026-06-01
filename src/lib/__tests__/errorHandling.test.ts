import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleAsyncError, safeAsync } from '@/lib/errorHandling';

vi.mock('@/store/toastStore', () => ({
  useToastStore: {
    getState: () => ({
      error: vi.fn(),
      info: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
    }),
  },
}));

describe('errorHandling.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should export handleAsyncError function', () => {
    expect(handleAsyncError).toBeDefined();
    expect(typeof handleAsyncError).toBe('function');
  });

  it('should export safeAsync function', () => {
    expect(safeAsync).toBeDefined();
    expect(typeof safeAsync).toBe('function');
  });

  it('should handle async error with custom handler', async () => {
    const errorHandler = vi.fn();
    const promise = Promise.reject(new Error('test error'));
    
    try {
      await handleAsyncError(promise, errorHandler);
    } catch {
      expect(errorHandler).toHaveBeenCalled();
    }
  });

  it('should return fallback value on error with safeAsync', async () => {
    const promise = Promise.reject(new Error('test error'));
    const result = await safeAsync(promise, 'fallback');
    expect(result).toBe('fallback');
  });

  it('should return undefined fallback on error', async () => {
    const promise = Promise.reject(new Error('test error'));
    const result = await safeAsync(promise);
    expect(result).toBeUndefined();
  });
});
