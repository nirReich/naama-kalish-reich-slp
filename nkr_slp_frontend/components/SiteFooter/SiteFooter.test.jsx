import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SiteFooter from './SiteFooter';

describe('SiteFooter', () => {
  it('contains the centered social links navigation', () => {
    const { container } = render(<SiteFooter t={(key) => key} />);
    const socialLinks = screen.getByRole('navigation', { name: 'Social links' });

    expect(container.querySelector('footer')).toContainElement(socialLinks);
  });
});
