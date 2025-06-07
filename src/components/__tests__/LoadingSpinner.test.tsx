import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';
import '@testing-library/jest-dom';


describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('div');
    
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).toHaveClass('h-6', 'w-6'); // default md size
  });

  it('renders with small size', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector('div');
    
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('renders with large size', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('div');
    
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    const spinner = container.querySelector('div');
    
    expect(spinner).toHaveClass('custom-class');
  });
});