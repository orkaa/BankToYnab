import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Bank CSV to YNAB Converter heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Bank CSV to YNAB Converter/i);
  expect(headingElement).toBeInTheDocument();
});