// packages/frontend/src/tests/utils/test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '../../context/AppContext';

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  routes?: Array<{
    path: string;
    element: ReactElement;
  }>;
}

// Render with all providers
export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    routes = [],
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function AllProviders({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <AppProvider>
          {children}
        </AppProvider>
      </MemoryRouter>
    );
  }
  
  // If there are routes to render
  if (routes.length > 0) {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <AppProvider>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </AppProvider>
      </MemoryRouter>,
      renderOptions
    );
  }

  return render(ui, { wrapper: AllProviders, ...renderOptions });
}

// Export all from testing-library for convenience
export * from '@testing-library/react';
export { renderWithProviders as render };