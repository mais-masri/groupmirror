import api from '../api';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}));

describe('API Service', () => {
  test('should be defined', () => {
    expect(api).toBeDefined();
  });

  test('should have request interceptor', () => {
    const axios = require('axios');
    expect(axios.create).toHaveBeenCalled();
  });
});
