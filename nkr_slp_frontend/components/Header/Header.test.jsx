import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';

const t = (key) => key;

describe('Header', () => {
  it('requests the opposite language when the language control is clicked', async () => {
    const user = userEvent.setup();
    const onLanguageChange = vi.fn();
    render(<Header language="he" onLanguageChange={onLanguageChange} t={t} />);

    await user.click(screen.getByRole('button', { name: 'EN' }));

    expect(onLanguageChange).toHaveBeenCalledWith('en');
  });

  it('toggles mobile navigation and closes it after a navigation link is selected', async () => {
    const user = userEvent.setup();
    render(<Header language="en" onLanguageChange={vi.fn()} t={t} />);
    const toggle = screen.getByRole('button', { name: 'openMenu' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'closeMenu' })).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('link', { name: 'nav.about' }));
    expect(screen.getByRole('button', { name: 'openMenu' })).toHaveAttribute('aria-expanded', 'false');
  });
});
