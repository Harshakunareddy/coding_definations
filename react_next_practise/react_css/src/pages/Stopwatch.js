import { useState, useRef, useCallback, useEffect } from 'react';
import './Stopwatch.css';

const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
};

export default function Stopwatch() {
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
    setLaps((prev) => [time, ...prev]);
  }, [isRunning, time]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Stopwatch</h1>
      <p className="page-subtitle">useRef for intervals, start/stop/reset, lap tracking</p>

      <div className="stopwatch-card">
        <div className="stopwatch-display">
          {formatTime(time)}
        </div>

        <div className="stopwatch-buttons">
          {!isRunning ? (
            <button className="stopwatch-btn stopwatch-btn--start" onClick={start}>
              {time === 0 ? 'Start' : 'Resume'}
            </button>
          ) : (
            <button className="stopwatch-btn stopwatch-btn--stop" onClick={stop}>
              Stop
            </button>
          )}
          <button className="stopwatch-btn stopwatch-btn--lap" onClick={lap} disabled={!isRunning}>
            Lap
          </button>
          <button className="stopwatch-btn stopwatch-btn--reset" onClick={reset} disabled={time === 0}>
            Reset
          </button>
        </div>

        {laps.length > 0 && (
          <div className="stopwatch-laps">
            <h3 className="stopwatch-laps-title">Laps ({laps.length})</h3>
            <div className="stopwatch-laps-list">
              {laps.map((lapTime, index) => (
                <div key={index} className="stopwatch-lap-item">
                  <span className="stopwatch-lap-num">Lap {laps.length - index}</span>
                  <span className="stopwatch-lap-time">{formatTime(lapTime)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
