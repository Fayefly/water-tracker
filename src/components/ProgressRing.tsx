import React from "react";

interface ProgressRingProps {
  current: number;
  goal: number;
  userName: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ current, goal }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="#e8e4de"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="url(#waterGradient)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-800">{current}</span>
          <span className="text-sm text-gray-400">/{goal}ml</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressRing;
