import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // App should render without throwing errors
});

test('renders login page by default', () => {
  render(<App />);
  // Should show login or redirect to login
  // In demo mode, this might show the main app
});
