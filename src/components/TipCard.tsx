import React, { useState } from "react";
import { rateJoke } from "../utils/api";

interface TipCardProps {
  tip: string;
  visible: boolean;
  userId: string;
}

const TipCard: React.FC<TipCardProps> = ({ tip, visible, userId }) => {
  const [rated, setRated] = useState<"like" | "dislike" | null>(null);

  if (!visible || !tip) return null;

  const handleRate = async (rating: "like" | "dislike") => {
    setRated(rating);
    try {
      await rateJoke(userId, tip, rating);
    } catch (err) {
      console.error("Rate failed:", err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <i className="fa-solid fa-face-laugh-squint text-amber-500"></i>
        <h2 className="text-base font-semibold text-amber-600">冷笑话</h2>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">{tip}</p>
      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
        <button
          onClick={() => handleRate("like")}
          disabled={rated !== null}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all ${
            rated === "like"
              ? "bg-green-50 text-green-600"
              : rated !== null
              ? "text-gray-300 cursor-default"
              : "text-gray-400 hover:bg-green-50 hover:text-green-600"
          }`}
        >
          <i className="fa-solid fa-thumbs-up"></i>
          <span>哈哈哈哈</span>
        </button>
        <button
          onClick={() => handleRate("dislike")}
          disabled={rated !== null}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all ${
            rated === "dislike"
              ? "bg-red-50 text-red-400"
              : rated !== null
              ? "text-gray-300 cursor-default"
              : "text-gray-400 hover:bg-red-50 hover:text-red-400"
          }`}
        >
          <i className="fa-solid fa-thumbs-down"></i>
          <span>啥玩意</span>
        </button>
      </div>
    </div>
  );
};

export default TipCard;
