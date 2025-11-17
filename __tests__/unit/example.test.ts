import { describe, it, expect } from 'vitest';

/**
 * Example unit test
 * This demonstrates the TDD approach we'll use throughout the project
 */
describe('Example Test Suite', () => {
  it('should pass a simple assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('success');
    expect(result).toBe('success');
  });
});
