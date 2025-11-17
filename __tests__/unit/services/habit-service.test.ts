import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { CreateHabitInput, UpdateHabitInput, Habit } from '@/types/habit';

// Create a mock habit for testing
const mockHabit: Habit = {
  id: 'habit-123',
  userId: 'user-123',
  name: 'Morning meditation',
  description: '10 minutes of mindfulness',
  category: 'health',
  frequency: { type: 'daily' },
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  archivedAt: null,
  sortOrder: 0,
};

// Mock the database with inline functions
vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([mockHabit])),
      })),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([mockHabit])),
        })),
        orderBy: vi.fn(() => Promise.resolve([mockHabit])),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([mockHabit])),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve(undefined)),
    })),
  },
}));

// Mock the schema
vi.mock('@/lib/db/schema', () => ({
  habits: {},
}));

// Import the functions to test
import { createHabit, getHabitsByUserId, updateHabit, deleteHabit, archiveHabit } from '@/lib/services/habit-service';

describe('Habit Service', () => {
  const mockUserId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createHabit', () => {
    it('should create a new habit with valid input', async () => {
      const input: CreateHabitInput = {
        name: 'Morning meditation',
        description: '10 minutes of mindfulness',
        category: 'health',
        frequency: { type: 'daily' },
      };

      const result = await createHabit(mockUserId, input);

      expect(result).toBeDefined();
      expect(result.name).toBe('Morning meditation');
      expect(result.userId).toBe(mockUserId);
      expect(result.category).toBe('health');
      expect(result.frequency).toEqual({ type: 'daily' });
    });

    it('should create a habit with weekly frequency', async () => {
      const input: CreateHabitInput = {
        name: 'Gym workout',
        category: 'health',
        frequency: {
          type: 'weekly',
          days: ['Mon', 'Wed', 'Fri'],
        },
      };

      const result = await createHabit(mockUserId, input);

      expect(result.frequency).toEqual({
        type: 'weekly',
        days: ['Mon', 'Wed', 'Fri'],
      });
    });

    it('should throw error for invalid input', async () => {
      const invalidInput = {
        name: '', // Empty name
        category: 'health',
        frequency: { type: 'daily' },
      } as CreateHabitInput;

      await expect(createHabit(mockUserId, invalidInput)).rejects.toThrow();
    });
  });

  describe('getHabitsByUserId', () => {
    it('should return all active habits for a user', async () => {
      const habits = await getHabitsByUserId(mockUserId);

      expect(Array.isArray(habits)).toBe(true);
    });

    it('should not return archived habits by default', async () => {
      const habits = await getHabitsByUserId(mockUserId);

      // All returned habits should have archivedAt as null
      habits.forEach((habit) => {
        expect(habit.archivedAt).toBeNull();
      });
    });

    it('should return archived habits when includeArchived is true', async () => {
      const habits = await getHabitsByUserId(mockUserId, { includeArchived: true });

      expect(Array.isArray(habits)).toBe(true);
      // May include habits with archivedAt set
    });
  });

  describe('updateHabit', () => {
    it('should update habit fields', async () => {
      const habitId = 'habit-123';
      const updates: UpdateHabitInput = {
        name: 'Updated habit name',
        description: 'Updated description',
      };

      const result = await updateHabit(habitId, mockUserId, updates);

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated habit name');
      expect(result.description).toBe('Updated description');
    });

    it('should allow partial updates', async () => {
      const habitId = 'habit-123';
      const updates: UpdateHabitInput = {
        name: 'New name only',
      };

      const result = await updateHabit(habitId, mockUserId, updates);

      expect(result.name).toBe('New name only');
    });

    it('should throw error for non-existent habit', async () => {
      const updates: UpdateHabitInput = { name: 'Test' };

      await expect(
        updateHabit('non-existent-id', mockUserId, updates)
      ).rejects.toThrow();
    });

    it('should prevent updating another users habit', async () => {
      const habitId = 'habit-123';
      const updates: UpdateHabitInput = { name: 'Hacked' };

      await expect(
        updateHabit(habitId, 'different-user-id', updates)
      ).rejects.toThrow();
    });
  });

  describe('archiveHabit', () => {
    it('should archive a habit', async () => {
      const habitId = 'habit-123';

      const result = await archiveHabit(habitId, mockUserId);

      expect(result.archivedAt).not.toBeNull();
      expect(result.archivedAt).toBeInstanceOf(Date);
    });
  });

  describe('deleteHabit', () => {
    it('should delete a habit permanently', async () => {
      const habitId = 'habit-123';

      await expect(deleteHabit(habitId, mockUserId)).resolves.not.toThrow();
    });

    it('should throw error when deleting non-existent habit', async () => {
      await expect(
        deleteHabit('non-existent-id', mockUserId)
      ).rejects.toThrow();
    });
  });
});
