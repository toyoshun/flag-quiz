import type { Country } from "../types";

/**
 * Build a list of multiple choice options for a question.
 * The returned array contains the correct country and three random other countries.
 */
export const getOptions = (
  countries: Country[],
  correctCountry: Country
): Country[] => {
  const shuffled = [...countries]
    .filter((c) => c.name !== correctCountry.name)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return [...shuffled, correctCountry].sort(() => 0.5 - Math.random());
};
