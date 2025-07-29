import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizScreen } from '../screens/QuizScreen';
import type { Country } from '../types';

describe('QuizScreen', () => {
  it('calls onAnswer when an option is selected', async () => {
    const countries: Country[] = [
      { name: 'A', code: 'AA', region: 'Asia' },
      { name: 'B', code: 'BB', region: 'Asia' },
      { name: 'C', code: 'CC', region: 'Asia' },
      { name: 'D', code: 'DD', region: 'Asia' },
    ];

    const onAnswer = vi.fn();
    const setUserAnswer = vi.fn();

    render(
      <QuizScreen
        mode="easy"
        countries={countries}
        questionIndex={0}
        correctCountry={countries[0]}
        totalQuestions={1}
        onAnswer={onAnswer}
        setUserAnswer={setUserAnswer}
        onPause={vi.fn()}
      />
    );

    await userEvent.click(screen.getAllByRole('button')[1]);
    expect(onAnswer).toHaveBeenCalled();
  });
});
