import React from "react";

// Final screen showing the user's score

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
      <div className="card flex flex-col justify-between">
        <div>
          <h2 className="heading-main">Quiz Finished! 🎊</h2>
          <p className="paragraph-main">You scored 🏅:</p>
          <p className="text-score">
            {score} / {total}
          </p>
        </div>

        <button className="btn-main" onClick={onRestart}>
          Play Again 🔄
        </button>
      </div>
    </div>
  );
};
