import React, { useState, useEffect, useRef } from "react";
import { rateJoke, getNewJoke } from "../utils/api";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslations } from "../utils/i18n";

interface TipCardProps {
  tip: string;
  visible: boolean;
  userId: string;
}

const TipCard: React.FC<TipCardProps> = ({ tip, visible, userId }) => {
  const { language } = useLanguage();
  const t = getTranslations(language);
  const [rated, setRated] = useState<"like" | "dislike" | null>(null);
  const [currentTip, setCurrentTip] = useState(tip);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (tip) {
      setCurrentTip(tip);
      setRated(null);
      setFeedback("");
    }
  }, [tip]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  if (!visible || !currentTip) return null;

  const showFeedback = (msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFeedback(msg);
    timerRef.current = setTimeout(() => {
      setFeedback("");
      setRated(null);
      timerRef.current = null;
    }, 1500);
  };

  const handleRate = async (rating: "like" | "dislike") => {
    setRated(rating);
    try {
      await rateJoke(userId, currentTip, rating);
      if (rating === "dislike") {
        showFeedback(t.feedbackSentSwitch);
        setLoading(true);
        const newJoke = await getNewJoke();
        if (newJoke) {
          setCurrentTip(newJoke);
        }
        setLoading(false);
        setFeedback("");
        setRated(null);
        if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      } else {
        showFeedback(t.feedbackSent);
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
        <h2 className="text-base font-semibold text-amber-600">{t.coldJoke}</h2>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">
        {loading ? t.jokeLoading : currentTip}
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
              <span>{t.jokeLike}</span>
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
              <span>{t.jokeDislike}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TipCard;
