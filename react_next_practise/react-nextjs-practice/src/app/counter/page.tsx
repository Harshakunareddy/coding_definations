// ==========================================
// COUNTER PAGE (Client Component)
// Shows: useReducer (Redux-like pattern without Redux),
//        action types, reducer function, dispatch
// ==========================================

"use client";

import { useReducer } from "react";

// Step 1: Define state type
interface CounterState {
  count: number;
  history: string[];
}

// Step 2: Define action types (like Redux action types)
type CounterAction =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "INCREMENT_BY"; payload: number }
  | { type: "RESET" };

// Step 3: Initial state
const initialState: CounterState = {
  count: 0,
  history: [],
};

// Step 4: Reducer function (pure function - no side effects)
function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
        history: [...state.history, `+1 → ${state.count + 1}`],
      };
    case "DECREMENT":
      return {
        count: state.count - 1,
        history: [...state.history, `-1 → ${state.count - 1}`],
      };
    case "INCREMENT_BY":
      return {
        count: state.count + action.payload,
        history: [...state.history, `+${action.payload} → ${state.count + action.payload}`],
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function CounterPage() {
  // Step 5: useReducer hook (returns [state, dispatch])
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Counter (useReducer)
      </h1>

      {/* Counter Display */}
      <div className="text-6xl font-bold mb-8 dark:text-white">{state.count}</div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center mb-8 flex-wrap">
        <button
          onClick={() => dispatch({ type: "DECREMENT" })}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xl font-bold"
        >
          -1
        </button>
        <button
          onClick={() => dispatch({ type: "INCREMENT" })}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xl font-bold"
        >
          +1
        </button>
        <button
          onClick={() => dispatch({ type: "INCREMENT_BY", payload: 5 })}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xl font-bold"
        >
          +5
        </button>
        <button
          onClick={() => dispatch({ type: "INCREMENT_BY", payload: 10 })}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-xl font-bold"
        >
          +10
        </button>
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-xl font-bold"
        >
          Reset
        </button>
      </div>

      {/* History Log */}
      {state.history.length > 0 && (
        <div className="text-left bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
          <h3 className="font-semibold mb-2 dark:text-white">History</h3>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {state.history.map((entry, index) => (
              <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                {index + 1}. {entry}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="mt-8 text-left bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm">
        <h3 className="font-semibold mb-2 dark:text-blue-300">Why useReducer?</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Better than useState for complex state logic</li>
          <li>Predictable state transitions (like Redux)</li>
          <li>Easy to test (reducer is a pure function)</li>
          <li>Actions describe &quot;what happened&quot;, not &quot;what to do&quot;</li>
        </ul>
      </div>
    </div>
  );
}
