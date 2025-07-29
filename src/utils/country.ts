import type { Country, Region } from "../types";

/** Shape of the raw country data loaded from JSON */
interface RawCountry {
  name?: { common?: string };
  cca2?: string;
  region?: string;
}

/**
 * Normalize the raw country list to the simplified Country type used in the app.
 */
export const normalizeCountries = (data: RawCountry[]): Country[] =>
  data.map((country) => ({
    name: country.name?.common || "Unknown",
    code: country.cca2 || "",
    region: country.region || "Other",
  }));

/**
 * Filter countries by region. When "World" is selected the whole array is
 * returned without modifications.
 */
export const filterCountriesByRegion = (
  countries: Country[],
  region: Region
): Country[] =>
  region === "World" ? countries : countries.filter((c) => c.region === region);
