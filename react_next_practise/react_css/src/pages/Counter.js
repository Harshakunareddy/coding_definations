import { useReducer } from 'react';
import './Counter.css';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'increment5':
      return { count: state.count + 5 };
    case 'decrement5':
      return { count: state.count - 5 };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getCountColor = () => {
    if (state.count > 0) return 'counter-value--positive';
    if (state.count < 0) return 'counter-value--negative';
    return '';
  };

  return (
    <div className="page">
      <h1 className="page-title">Counter</h1>
      <p className="page-subtitle">useReducer based counter with multiple actions</p>

      <div className="counter-card">
        <div className={`counter-value ${getCountColor()}`}>
          {state.count}
        </div>

        <div className="counter-buttons">
          <button
            className="counter-btn counter-btn--danger"
            onClick={() => dispatch({ type: 'decrement5' })}
          >
            -5
          </button>
          <button
            className="counter-btn counter-btn--secondary"
            onClick={() => dispatch({ type: 'decrement' })}
          >
            -1
          </button>
          <button
            className="counter-btn counter-btn--outline"
            onClick={() => dispatch({ type: 'reset' })}
          >
            Reset
          </button>
          <button
            className="counter-btn counter-btn--primary"
            onClick={() => dispatch({ type: 'increment' })}
          >
            +1
          </button>
          <button
            className="counter-btn counter-btn--success"
            onClick={() => dispatch({ type: 'increment5' })}
          >
            +5
          </button>
        </div>
      </div>
    </div>
  );
}
