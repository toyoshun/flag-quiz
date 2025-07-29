import React, { useState } from "react";
import type { Mode, Region, Country } from "../types";

const regions: Region[] = [
  "World",
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
];

const questionCounts = [5, 10, 20, 30, 40, 50, 100];

export const StartScreen: React.FC<{
  onStart: (mode: Mode, region: Region, totalQuestions: number) => void;
  allCountries: Country[];
}> = ({ onStart, allCountries }) => {
  const [selectedMode, setSelectedMode] = useState<Mode>("easy");
  const [selectedRegion, setSelectedRegion] = useState<Region>("World");
  const [selectedCount, setSelectedCount] = useState<number>(10);

  // 選択中regionの国数を計算
  const filteredCountries =
    selectedRegion === "World"
      ? allCountries
      : allCountries.filter((c) => c.region === selectedRegion);
  const maxCount = filteredCountries.length;

  // region内の国数以下の選択肢だけ表示
  const availableCounts = questionCounts.filter((count) => count <= maxCount);

  // 「すべて」選択肢を追加
  const countsWithAll = [
    ...availableCounts,
    ...(availableCounts.includes(maxCount) ? [] : [maxCount]),
  ];

  // 選択肢が変更された際に、現在の値が選択肢に存在しなければ修正
  React.useEffect(() => {
    if (!countsWithAll.includes(selectedCount)) {
      setSelectedCount(countsWithAll[countsWithAll.length - 1]);
    }
  }, [selectedRegion]);

  return (
    <div className="screen-wrapper">
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

      <div className="select-group">
        <label className="select-label">Number of Questions:</label>
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

      <button
        className="start-button"
        onClick={() => onStart(selectedMode, selectedRegion, selectedCount)}
      >
        Start
      </button>
    </div>
  );
};
