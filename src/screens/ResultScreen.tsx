import React from "react";

interface ResultScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  total,
  onRestart,
}) => {
  return (
    <div className="screen-wrapper">
      <div className="card">
        <h2 className="heading-main">Quiz Finished! 🎊</h2>
        <p className="paragraph-main">You scored 🏅:</p>
        <p className="text-score">
          {score} / {total}
        </p>

        <button className="btn-main" onClick={onRestart}>
          Play Again 🔄
        </button>
      </div>
    </div>
  );
};
