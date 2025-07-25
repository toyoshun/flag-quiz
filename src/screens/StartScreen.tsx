import React, { useState } from "react";
import type { Mode, Region } from "../types";

const regions: Region[] = [
  "World",
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
];

export const StartScreen: React.FC<{
  onStart: (mode: Mode, region: Region) => void;
}> = ({ onStart }) => {
  const [selectedMode, setSelectedMode] = useState<Mode>("easy");
  const [selectedRegion, setSelectedRegion] = useState<Region>("World");

  return (
    <div className="start-container">
      <h1 className="start-title">Flag Quiz</h1>

      <div className="select-group">
        <label className="select-label">Select Mode:</label>
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
        <label className="select-label">Select Region:</label>
        <select
          className="select-input"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value as Region)}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <button
        className="start-button"
        onClick={() => onStart(selectedMode, selectedRegion)}
      >
        Start
      </button>
    </div>
  );
};
