import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ContactSection from './ContactSection';

const contactTranslations = {
  'contact.address1': '8 Tirat Tsvi Street',
  'contact.address2': 'Tel Aviv-Yafo',
  'contact.address3': '20 Sasha Argov Street',
  'contact.address4': "Ra'anana",
  'contact.map': 'Open map',
};
const t = (key) => contactTranslations[key] ?? key;

describe('ContactSection', () => {
  it('does not render a duplicate footer row', () => {
    render(<ContactSection t={t} />);

    expect(screen.queryByRole('link', { name: 'backToTop ↑' })).not.toBeInTheDocument();
  });

  it('shows both clinic locations with separate map links', () => {
    render(<ContactSection t={t} />);

    expect(screen.getByText(/20 Sasha Argov Street/)).toBeInTheDocument();
    expect(screen.getByText(/Ra'anana/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open map — 8 Tirat Tsvi Street' })).toHaveAttribute('href', expect.stringContaining('Tirat'));
    expect(screen.getByRole('link', { name: 'Open map — 20 Sasha Argov Street' })).toHaveAttribute('href', expect.stringContaining('Sasha'));
  });
});
