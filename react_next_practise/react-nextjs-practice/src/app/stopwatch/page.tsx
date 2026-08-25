// ==========================================
// STOPWATCH PAGE
// Shows: useRef for interval ID, useEffect cleanup,
//        setInterval pattern, time formatting
// Classic interview question: "Build a stopwatch/timer"
// ==========================================

"use client";

import { useState, useRef, useEffect } from "react";

export default function StopwatchPage() {
  const [time, setTime] = useState(0); // time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start/Stop the stopwatch
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10); // Update every 10ms
      }, 10);
    }

    // Cleanup: clear interval when component unmounts or isRunning changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };
  const lap = () => setLaps((prev) => [time, ...prev]);

  // Format milliseconds to MM:SS.ms
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-8 dark:text-white">Stopwatch</h1>

      {/* Time Display */}
      <div className="text-6xl font-mono font-bold mb-8 dark:text-white tracking-wider">
        {formatTime(time)}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {!isRunning ? (
          <button
            onClick={start}
            className="px-8 py-3 bg-green-500 text-white rounded-full text-lg font-semibold hover:bg-green-600 transition-colors"
          >
            {time === 0 ? "Start" : "Resume"}
          </button>
        ) : (
          <button
            onClick={stop}
            className="px-8 py-3 bg-red-500 text-white rounded-full text-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Stop
          </button>
        )}

        {isRunning && (
          <button
            onClick={lap}
            className="px-8 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Lap
          </button>
        )}

        {!isRunning && time > 0 && (
          <button
            onClick={reset}
            className="px-8 py-3 bg-gray-500 text-white rounded-full text-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Laps List */}
      {laps.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
          <div className="flex justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 font-semibold text-sm dark:text-white">
            <span>Lap</span>
            <span>Time</span>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {laps.map((lapTime, index) => (
              <div
                key={index}
                className="flex justify-between px-4 py-2 border-t dark:border-gray-700 text-sm"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  Lap {laps.length - index}
                </span>
                <span className="font-mono dark:text-white">{formatTime(lapTime)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
