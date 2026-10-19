import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SocialLinks from './SocialLinks';

describe('SocialLinks', () => {
  it('renders the supplied social and contact links', () => {
    render(<SocialLinks />);

    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', 'https://www.instagram.com/naamakalishreich_slp_dub/');
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', 'https://wa.me/972544281134');
    expect(screen.getByRole('link', { name: 'Facebook' })).toHaveAttribute('href', 'https://www.facebook.com/naamaklinait');
    expect(screen.getByRole('link', { name: 'Google' })).toHaveAttribute('href', 'https://www.google.com/search?q=%D7%A0%D7%A2%D7%9E%D7%94+%D7%A7%D7%9C%D7%99%D7%A9+%D7%A8%D7%99%D7%99%D7%9A');
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:kalishn@gmail.com');
  });
});
