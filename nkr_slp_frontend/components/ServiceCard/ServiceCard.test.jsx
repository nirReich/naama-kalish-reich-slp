import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ServiceCard from './ServiceCard';

describe('ServiceCard', () => {
  it('renders the title and description as one link and hides its decorative icon', () => {
    render(<ServiceCard icon={<svg data-testid="service-icon" />} title="Speech" description="Speech support" href="#contact" />);

    const link = screen.getByRole('link', { name: 'Speech Speech support' });
    expect(link).toHaveAttribute('href', '#contact');
    expect(screen.getByTestId('service-icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });
});
