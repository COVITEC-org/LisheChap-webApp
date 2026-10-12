import { act, fireEvent, screen } from '@testing-library/react';
import { useState } from 'react';
import { Link } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders, stubMatchMedia } from '../../test/renderWithProviders.jsx';
import { Button } from './Button.jsx';
import { TextField } from './Field.jsx';
import { Modal } from './Modal.jsx';
import { SmartImage } from './SmartImage.jsx';
import { ErrorState } from './StateMessage.jsx';

beforeEach(() => {
  stubMatchMedia(false);
});

describe('Button', () => {
  it('defaults to type="button" so it never submits forms by accident', () => {
    renderWithProviders(<Button>Agiza</Button>);
    expect(screen.getByRole('button', { name: 'Agiza' })).toHaveAttribute('type', 'button');
  });

  it('is disabled and busy while loading', () => {
    const onClick = vi.fn();
    renderWithProviders(
      <Button loading onClick={onClick}>
        Lipa sasa
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Lipa sasa' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders as a link for navigation', () => {
    renderWithProviders(
      <Button as={Link} to="/migahawa">
        Migahawa
      </Button>,
    );
    expect(screen.getByRole('link', { name: 'Migahawa' })).toHaveAttribute('href', '/migahawa');
  });
});

describe('TextField', () => {
  it('links label, hint and error for assistive technology', () => {
    renderWithProviders(<TextField label="Namba ya simu" hint="Mfano 0712" error="Namba si sahihi" />);
    const input = screen.getByLabelText('Namba ya simu');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Namba si sahihi');
    expect(screen.getByRole('alert')).toHaveTextContent('Namba si sahihi');
  });

  it('shows the hint when there is no error', () => {
    renderWithProviders(<TextField label="Namba ya simu" hint="Mfano 0712" />);
    expect(screen.getByLabelText('Namba ya simu')).toHaveAccessibleDescription('Mfano 0712');
  });
});

describe('Modal', () => {
  function ModalHarness() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Fungua</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Thibitisha chakula">
          <Button>Omba uthibitisho</Button>
        </Modal>
      </>
    );
  }

  it('opens as an accessible dialog, moves focus inside and closes on Escape', () => {
    renderWithProviders(<ModalHarness />);
    const trigger = screen.getByRole('button', { name: 'Fungua' });
    trigger.focus();

    act(() => trigger.click());

    const dialog = screen.getByRole('dialog', { name: 'Thibitisha chakula' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toContainElement(document.activeElement);
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe('');
  });

  it('keeps Tab focus inside the dialog', () => {
    renderWithProviders(<ModalHarness />);
    act(() => screen.getByRole('button', { name: 'Fungua' }).click());

    const closeButton = screen.getByRole('button', { name: 'Funga' });
    const lastButton = screen.getByRole('button', { name: 'Omba uthibitisho' });

    lastButton.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(lastButton);
  });
});

describe('SmartImage', () => {
  it('shows the placeholder when no image is provided', () => {
    const { container } = renderWithProviders(<SmartImage alt="Chipsi kuku" />);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('Chipsi kuku')).toBeInTheDocument();
  });

  it('falls back to the placeholder when the image fails to load', () => {
    const { container } = renderWithProviders(<SmartImage src="/missing.jpg" alt="Pilau" />);
    const image = container.querySelector('img');
    expect(image).toHaveAttribute('loading', 'lazy');

    fireEvent.error(image);

    expect(container.querySelector('img')).toBeNull();
  });
});

describe('ErrorState', () => {
  it('announces the error and offers a working retry', () => {
    const onRetry = vi.fn();
    renderWithProviders(<ErrorState description="Malipo hayajakamilika." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Malipo hayajakamilika.');
    fireEvent.click(screen.getByRole('button', { name: 'Jaribu tena' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('omits the retry button when no handler is given', () => {
    renderWithProviders(<ErrorState />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
