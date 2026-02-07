"use client";

import { cn } from "@/lib/utils";

interface CalorieRingProps {
  progress: number;
  consumed: number;
  size?: number;
  strokeWidth?: number;
}

export function CalorieRing({ 
  progress, 
  consumed, 
  size = 120, 
  strokeWidth = 12 
}: CalorieRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;
  
  // Color based on progress
  const getColor = () => {
    if (progress >= 1) return "text-destructive";
    if (progress >= 0.85) return "text-warning";
    return "text-primary";
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-500", getColor())}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-foreground tracking-tight">{consumed}</span>
        <span className="text-xs text-whisper">eaten</span>
      </div>
    </div>
  );
}
