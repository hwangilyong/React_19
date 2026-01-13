import { render, screen } from '@testing-library/react';
import BtnBasic from './BtnBasic';

describe('BtnBasic', () => {
  it('renders children text', () => {
    render(<BtnBasic>Click me</BtnBasic>);

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders an icon when leftIco is provided', () => {
    const { container } = render(<BtnBasic leftIco="/icon.svg">With icon</BtnBasic>);

    expect(container.querySelector('img')).toBeInTheDocument();
  });
});
