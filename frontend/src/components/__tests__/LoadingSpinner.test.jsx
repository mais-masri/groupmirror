import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders with default props', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders with custom text', () => {
    render(<LoadingSpinner text="Please wait..." />);
    
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  test('renders without text when text is empty', () => {
    render(<LoadingSpinner text="" />);
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('applies correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    let spinner = document.querySelector('.w-4.h-4');
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingSpinner size="large" />);
    spinner = document.querySelector('.w-8.h-8');
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingSpinner size="medium" />);
    spinner = document.querySelector('.w-6.h-6');
    expect(spinner).toBeInTheDocument();
  });

  test('applies default size when invalid size is provided', () => {
    render(<LoadingSpinner size="invalid" />);
    
    const spinner = document.querySelector('.w-6.h-6');
    expect(spinner).toBeInTheDocument();
  });
});
