import React, { useState } from "react";
import { rateJoke, getNewJoke } from "../utils/api";

interface TipCardProps {
  tip: string;
  visible: boolean;
  userId: string;
}

const TipCard: React.FC<TipCardProps> = ({ tip, visible, userId }) => {
  const [rated, setRated] = useState<"like" | "dislike" | null>(null);
  const [currentTip, setCurrentTip] = useState(tip);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  if (!visible || !currentTip) return null;

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback("");
      setRated(null);
    }, 1500);
  };

  const handleRate = async (rating: "like" | "dislike") => {
    setRated(rating);
    try {
      await rateJoke(userId, currentTip, rating);
      if (rating === "dislike") {
        showFeedback("已提交反馈，换一个...");
        setLoading(true);
        const newJoke = await getNewJoke();
        if (newJoke) {
          setCurrentTip(newJoke);
        }
        setLoading(false);
        setFeedback("");
        setRated(null);
      } else {
        showFeedback("已提交反馈");
      }
    } catch (err) {
      console.error("Rate failed:", err);
      setLoading(false);
      setRated(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <i className="fa-solid fa-face-laugh-squint text-amber-500"></i>
        <h2 className="text-base font-semibold text-amber-600">冷笑话</h2>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">
        {loading ? "换一个..." : currentTip}
      </p>
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-gray-100">
        {feedback ? (
          <span className="text-sm text-gray-400 py-1.5">{feedback}</span>
        ) : (
          <>
            <button
              onClick={() => handleRate("like")}
              disabled={rated !== null || loading}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all ${
                rated === "like"
                  ? "bg-green-50 text-green-600"
                  : "text-gray-400 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <i className="fa-solid fa-thumbs-up"></i>
              <span>哈哈哈哈</span>
            </button>
            <button
              onClick={() => handleRate("dislike")}
              disabled={rated !== null || loading}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all ${
                rated === "dislike"
                  ? "bg-red-50 text-red-400"
                  : "text-gray-400 hover:bg-red-50 hover:text-red-400"
              }`}
            >
              <i className="fa-solid fa-thumbs-down"></i>
              <span>啥玩意</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TipCard;
