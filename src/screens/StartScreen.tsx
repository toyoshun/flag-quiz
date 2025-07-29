import React, { useState } from "react";
import type { Mode, Region, Country } from "../types";
import { REGIONS, QUESTION_COUNTS } from "../utils/constants";

// Initial configuration screen where the user selects mode and region

export const StartScreen: React.FC<{
  onStart: (mode: Mode, region: Region, totalQuestions: number) => void;
  allCountries: Country[];
  onResume?: () => void;
  canResume?: boolean;
}> = ({ onStart, allCountries, onResume, canResume = false }) => {
  const [selectedMode, setSelectedMode] = useState<Mode>("easy");
  const [selectedRegion, setSelectedRegion] = useState<Region>("World");
  const [selectedCount, setSelectedCount] = useState<number>(10);

  // Number of countries in the currently selected region
  const filteredCountries = React.useMemo(
    () =>
      selectedRegion === "World"
        ? allCountries
        : allCountries.filter((c) => c.region === selectedRegion),
    [selectedRegion, allCountries]
  );
  const maxCount = filteredCountries.length;

  // Offer only question counts that fit within this region
  const availableCounts = React.useMemo(
    () => QUESTION_COUNTS.filter((count) => count <= maxCount),
    [maxCount]
  );

  // Add an "All" option representing every country
  const countsWithAll = React.useMemo(
    () => [
      ...availableCounts,
      ...(availableCounts.includes(maxCount) ? [] : [maxCount]),
    ],
    [availableCounts, maxCount]
  );

  // Ensure the selected count is valid when the region changes
  React.useEffect(() => {
    if (!countsWithAll.includes(selectedCount)) {
      setSelectedCount(countsWithAll[countsWithAll.length - 1]);
    }
  }, [selectedRegion, countsWithAll, selectedCount]);

  return (
    <div className="screen-wrapper">
      <div className="card flex flex-col">
        <div className="flex-grow">
          <h1 className="start-title">Flag Quiz 🌎</h1>

          <div className="select-group">
            <label className="select-label">Select Mode 📖:</label>
            <select
              className="select-input"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as Mode)}
            >
              <option value="easy">Easy (Multiple Choice)</option>
              <option value="hard">Hard (Input)</option>
            </select>
          </div>

          <div className="select-group">
            <label className="select-label">Select Region 🗺️:</label>
            <select
              className="select-input"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as Region)}
            >
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="select-group">
            <label className="select-label">Number of Questions ❓:</label>
            <select
              className="select-input"
              value={selectedCount}
              onChange={(e) => setSelectedCount(Number(e.target.value))}
            >
              {countsWithAll.map((count) => (
                <option key={count} value={count}>
                  {count === maxCount ? `All (${maxCount})` : count}
                </option>
              ))}
            </select>
            <div className="text-sm text-gray-500 mt-1">
              {maxCount} countries in this region
            </div>
          </div>
        </div>

        {canResume && onResume && (
          <button className="resume-button mb-2" onClick={onResume}>
            ▶️ Resume
          </button>
        )}
        <button
          className="start-button"
          onClick={() => onStart(selectedMode, selectedRegion, selectedCount)}
        >
          🚀 Start
        </button>
      </div>
    </div>
  );
};
