"use client";

import { useEffect, useMemo, useState } from "react";

export interface CountdownTimerProps {
  targetDate: string | Date;
  title?: string;
  description?: string;
  completedText?: string;
  className?: string;
}

interface TimeSegment {
  label: string;
  value: number;
}

function getTimeRemaining(targetTime: number) {
  const difference = Math.max(targetTime - Date.now(), 0);

  return {
    total: difference,
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function formatValue(value: number) {
  return value.toString().padStart(2, "0");
}

export function CountdownTimer({
  targetDate,
  title = "Countdown timer",
  description = "Track time remaining until your launch, promotion, or event.",
  completedText = "The countdown has ended.",
  className = "",
}: CountdownTimerProps) {
  const targetTime = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [timeLeft, setTimeLeft] = useState(() => ({
    total: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }));

  useEffect(() => {
    if (Number.isNaN(targetTime)) {
      return;
    }

    const updateCountdown = () => {
      setTimeLeft(getTimeRemaining(targetTime));
    };

    updateCountdown();

    const interval = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [targetTime]);

  const segments: TimeSegment[] = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  if (Number.isNaN(targetTime)) {
    return (
      <div
        className={`rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 ${className}`}
      >
        Invalid target date.
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-700 p-6 text-white shadow-sm ${className}`}
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
          {title}
        </p>
        <p className="max-w-2xl text-sm text-slate-200">{description}</p>
      </div>

      {timeLeft.total === 0 ? (
        <div className="mt-6 rounded-xl bg-white/10 p-4 text-sm font-medium text-sky-50">
          {completedText}
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {segments.map((segment) => (
            <div
              key={segment.label}
              className="rounded-xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur"
            >
              <div className="text-3xl font-bold tracking-tight">
                {formatValue(segment.value)}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-sky-100">
                {segment.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
