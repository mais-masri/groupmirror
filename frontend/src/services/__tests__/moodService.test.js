import { createMood, getMoods, getGroupMoods } from '../moodService';

// Mock the API
jest.mock('../api', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('MoodService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMood', () => {
    test('should create mood with valid input', async () => {
      const result = await createMood(4, 'Feeling good!');
      
      expect(result).toBeDefined();
      expect(result.value).toBe(4);
      expect(result.note).toBe('Feeling good!');
      expect(result.id).toContain('demo-mood-');
    });

    test('should throw error for invalid mood value', async () => {
      await expect(createMood(0)).rejects.toThrow('Mood value must be between 1 and 5');
      await expect(createMood(6)).rejects.toThrow('Mood value must be between 1 and 5');
      await expect(createMood(null)).rejects.toThrow('Mood value must be between 1 and 5');
    });

    test('should create mood without note', async () => {
      const result = await createMood(3);
      
      expect(result).toBeDefined();
      expect(result.value).toBe(3);
      expect(result.note).toBe('');
    });
  });

  describe('getMoods', () => {
    test('should return demo moods', async () => {
      const result = await getMoods();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('value');
      expect(result[0]).toHaveProperty('createdAt');
    });
  });

  describe('getGroupMoods', () => {
    test('should return group moods with valid groupId', async () => {
      const result = await getGroupMoods('test-group-id');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('user');
      expect(result[0].user).toHaveProperty('name');
    });

    test('should throw error for missing groupId', async () => {
      await expect(getGroupMoods()).rejects.toThrow('Group ID is required');
      await expect(getGroupMoods('')).rejects.toThrow('Group ID is required');
    });
  });
});
