import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ContactSection from './ContactSection';

describe('ContactSection', () => {
  it('does not render a duplicate footer row', () => {
    render(<ContactSection t={(key) => key} />);

    expect(screen.queryByRole('link', { name: 'backToTop ↑' })).not.toBeInTheDocument();
  });
});
