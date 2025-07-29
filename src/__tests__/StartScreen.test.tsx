import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StartScreen } from '../screens/StartScreen';
import type { Country } from '../types';

const sampleCountries: Country[] = [
  { name: 'A1', code: 'A1', region: 'Asia' },
  { name: 'A2', code: 'A2', region: 'Asia' },
  { name: 'A3', code: 'A3', region: 'Asia' },
  { name: 'A4', code: 'A4', region: 'Asia' },
  { name: 'E1', code: 'E1', region: 'Europe' },
  { name: 'E2', code: 'E2', region: 'Europe' },
];

describe('StartScreen', () => {
  it('updates question-count options when region changes', async () => {
    render(<StartScreen onStart={vi.fn()} allCountries={sampleCountries} />);

    const selects = screen.getAllByRole('combobox');
    const regionSelect = selects[1];
    const countSelect = selects[2];

    // World should show options for 6 countries -> [5,6]
    expect(within(countSelect).getAllByRole('option')).toHaveLength(2);

    await userEvent.selectOptions(regionSelect, 'Asia');

    const updatedCountSelect = screen.getAllByRole('combobox')[2];
    const options = within(updatedCountSelect).getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('All (4)');
  });
});
