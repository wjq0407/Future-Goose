import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('utils.ts', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('foo', 'bar', 'baz');
      expect(result).toBe('foo bar baz');
    });

    it('should handle conditional classes with arrays', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn('base', [isActive && 'active'], [isDisabled && 'disabled']);
      expect(result).toContain('base');
      expect(result).toContain('active');
      expect(result).not.toContain('disabled');
    });

    it('should handle object syntax for conditional classes', () => {
      const result = cn('btn', { 'btn-active': true, 'btn-disabled': false });
      expect(result).toBe('btn btn-active');
    });

    it('should merge Tailwind classes intelligently', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle falsy values', () => {
      const result = cn('foo', false, null, undefined, 0, '');
      expect(result).toBe('foo');
    });
  });
});
