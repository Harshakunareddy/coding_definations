import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

export default function Stopwatch() {
  const { theme } = useTheme();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now() - time;
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10);
  }, [isRunning, time]);

  const stop = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }, [isRunning]);

  const reset = useCallback(() => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setTime(0);
    setLaps([]);
  }, []);

  const lap = useCallback(() => {
    if (!isRunning) return;
    const prevLapTime = laps.length > 0 ? laps[0].totalTime : 0;
    setLaps((prev) => [
      {
        id: Date.now(),
        number: prev.length + 1,
        lapTime: time - prevLapTime,
        totalTime: time,
      },
      ...prev,
    ]);
  }, [isRunning, time, laps]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Find best and worst laps
  const bestLap = laps.length > 1
    ? laps.reduce((best, l) => (l.lapTime < best.lapTime ? l : best))
    : null;
  const worstLap = laps.length > 1
    ? laps.reduce((worst, l) => (l.lapTime > worst.lapTime ? l : worst))
    : null;

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-6">Stopwatch</h1>

      {/* Time Display */}
      <div className="text-6xl font-mono font-bold mb-8 tracking-wider">
        {formatTime(time)}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 justify-center mb-8">
        {!isRunning ? (
          <button
            onClick={start}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-lg"
          >
            {time === 0 ? "Start" : "Resume"}
          </button>
        ) : (
          <button
            onClick={stop}
            className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-lg"
          >
            Stop
          </button>
        )}

        <button
          onClick={lap}
          disabled={!isRunning}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lap
        </button>

        <button
          onClick={reset}
          className={`px-8 py-3 rounded-lg font-semibold text-lg border transition-colors ${
            theme === "dark"
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Reset
        </button>
      </div>

      {/* Laps Table */}
      {laps.length > 0 && (
        <div
          className={`rounded-lg border overflow-hidden ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead
                className={`sticky top-0 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Lap</th>
                  <th className="px-4 py-2 text-right font-semibold">Lap Time</th>
                  <th className="px-4 py-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {laps.map((l) => {
                  const isBest = bestLap && l.id === bestLap.id;
                  const isWorst = worstLap && l.id === worstLap.id;
                  return (
                    <tr
                      key={l.id}
                      className={`border-t ${
                        theme === "dark" ? "border-gray-700" : "border-gray-100"
                      } ${isBest ? "text-green-500" : isWorst ? "text-red-500" : ""}`}
                    >
                      <td className="px-4 py-2 text-left">
                        #{l.number}
                        {isBest && " (Best)"}
                        {isWorst && " (Worst)"}
                      </td>
                      <td className="px-4 py-2 text-right font-mono">
                        {formatTime(l.lapTime)}
                      </td>
                      <td className="px-4 py-2 text-right font-mono">
                        {formatTime(l.totalTime)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
