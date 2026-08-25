import { useReducer } from "react";
import { useTheme } from "../context/ThemeContext";

const initialState = {
  count: 0,
  history: [],
};

function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
        history: [...state.history, `+1 -> ${state.count + 1}`],
      };
    case "DECREMENT":
      return {
        count: state.count - 1,
        history: [...state.history, `-1 -> ${state.count - 1}`],
      };
    case "INCREMENT_BY":
      return {
        count: state.count + action.payload,
        history: [...state.history, `+${action.payload} -> ${state.count + action.payload}`],
      };
    case "DECREMENT_BY":
      return {
        count: state.count - action.payload,
        history: [...state.history, `-${action.payload} -> ${state.count - action.payload}`],
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);
  const { theme } = useTheme();

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-6">Counter (useReducer)</h1>

      {/* Counter Display */}
      <div className="text-6xl font-bold mb-8">{state.count}</div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center mb-8 flex-wrap">
        <button
          onClick={() => dispatch({ type: "DECREMENT_BY", payload: 5 })}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-xl font-bold"
        >
          -5
        </button>
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
          onClick={() => dispatch({ type: "RESET" })}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-xl font-bold"
        >
          Reset
        </button>
      </div>

      {/* History Log */}
      {state.history.length > 0 && (
        <div
          className={`text-left rounded-lg border p-4 ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="font-semibold mb-2">History</h3>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {state.history.map((entry, index) => (
              <p
                key={index}
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                {index + 1}. {entry}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Explanation */}
      <div
        className={`mt-8 text-left p-4 rounded-lg text-sm ${
          theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
        }`}
      >
        <h3 className={`font-semibold mb-2 ${theme === "dark" ? "text-blue-300" : "text-blue-800"}`}>
          Why useReducer?
        </h3>
        <ul
          className={`list-disc pl-5 space-y-1 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <li>Better than useState for complex state logic</li>
          <li>Predictable state transitions (like Redux)</li>
          <li>Easy to test (reducer is a pure function)</li>
          <li>Actions describe "what happened", not "what to do"</li>
        </ul>
      </div>
    </div>
  );
}
