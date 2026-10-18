import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import HomePage from './page';

beforeEach(() => {
  window.localStorage.setItem('site-language', 'en');
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.lang = 'he';
  document.documentElement.dir = 'rtl';
});

describe('HomePage locale', () => {
  it('restores English and synchronizes document language and direction', async () => {
    render(<HomePage />);

    expect(await screen.findByRole('heading', { name: /find your/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(document.documentElement.lang).toBe('en');
      expect(document.documentElement.dir).toBe('ltr');
    });
  });
});
