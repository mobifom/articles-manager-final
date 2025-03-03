import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

// Mock the lazy loaded components to avoid test issues
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    lazy: (factory) => {
      const Component = () => <div>Mocked Component</div>;
      Component.displayName = 'MockedComponent';
      return Component;
    },
    Suspense: ({ children }) => <>{children}</>,
  };
});

// Mock Navbar and Footer components
jest.mock('../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../components/Footer', () => () => <div data-testid="footer">Footer</div>);

describe('App Component', () => {
  it('should render successfully', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Check that the navbar and footer are rendered
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    
    // Check that the main content area is rendered
    expect(screen.getByText('Mocked Component')).toBeInTheDocument();
  });
});