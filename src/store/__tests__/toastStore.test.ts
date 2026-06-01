import { describe, it, expect, beforeEach } from 'vitest';
import { useToastStore } from '@/store/toastStore';

describe('toastStore.ts', () => {
  beforeEach(() => {
    useToastStore.getState().clearToasts();
  });

  describe('addToast', () => {
    it('should add a toast and return its id', () => {
      const id = useToastStore.getState().addToast({
        type: 'info',
        message: 'Test message',
      });
      
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      
      const state = useToastStore.getState();
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].id).toBe(id);
      expect(state.toasts[0].message).toBe('Test message');
      expect(state.toasts[0].type).toBe('info');
    });

    it('should assign default duration based on type', () => {
      useToastStore.getState().addToast({ type: 'success', message: 'Success' });
      useToastStore.getState().addToast({ type: 'error', message: 'Error' });
      useToastStore.getState().addToast({ type: 'warning', message: 'Warning' });
      useToastStore.getState().addToast({ type: 'info', message: 'Info' });

      const toasts = useToastStore.getState().toasts;
      expect(toasts[0].duration).toBe(3000);
      expect(toasts[1].duration).toBe(5000);
      expect(toasts[2].duration).toBe(4000);
      expect(toasts[3].duration).toBe(3000);
    });

    it('should use custom duration if provided', () => {
      useToastStore.getState().addToast({
        type: 'info',
        message: 'Test',
        duration: 10000,
      });

      const state = useToastStore.getState();
      expect(state.toasts[0].duration).toBe(10000);
    });
  });

  describe('removeToast', () => {
    it('should remove a toast by id', () => {
      const _id = useToastStore.getState().addToast({
        type: 'info',
        message: 'Test',
      });

      useToastStore.getState().removeToast(_id);
      const state = useToastStore.getState();
      expect(state.toasts).toHaveLength(0);
    });

    it('should not affect other toasts', () => {
      const id1 = useToastStore.getState().addToast({ type: 'info', message: 'Test 1' });
      const id2 = useToastStore.getState().addToast({ type: 'info', message: 'Test 2' });

      useToastStore.getState().removeToast(id1);
      const state = useToastStore.getState();
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].id).toBe(id2);
    });
  });

  describe('clearToasts', () => {
    it('should clear all toasts', () => {
      useToastStore.getState().addToast({ type: 'info', message: 'Test 1' });
      useToastStore.getState().addToast({ type: 'info', message: 'Test 2' });
      useToastStore.getState().addToast({ type: 'info', message: 'Test 3' });

      useToastStore.getState().clearToasts();
      expect(useToastStore.getState().toasts).toHaveLength(0);
    });
  });

  describe('convenience methods', () => {
    it('should create success toast', () => {
      useToastStore.getState().success('Success message');
      const state = useToastStore.getState();
      expect(state.toasts[0].type).toBe('success');
      expect(state.toasts[0].message).toBe('Success message');
    });

    it('should create error toast', () => {
      useToastStore.getState().error('Error message');
      const state = useToastStore.getState();
      expect(state.toasts[0].type).toBe('error');
      expect(state.toasts[0].message).toBe('Error message');
    });

    it('should create warning toast', () => {
      useToastStore.getState().warning('Warning message');
      const state = useToastStore.getState();
      expect(state.toasts[0].type).toBe('warning');
      expect(state.toasts[0].message).toBe('Warning message');
    });

    it('should create info toast', () => {
      useToastStore.getState().info('Info message');
      const state = useToastStore.getState();
      expect(state.toasts[0].type).toBe('info');
      expect(state.toasts[0].message).toBe('Info message');
    });

    it('should support description parameter', () => {
      useToastStore.getState().success('Title', 'Description');
      const state = useToastStore.getState();
      expect(state.toasts[0].description).toBe('Description');
    });
  });
});
