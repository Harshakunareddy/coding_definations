/*
========================================
REDUX (SIMPLE EXPLANATION)
========================================

1. Store → global state (single source of truth)
2. Slice → contains state + reducers
3. Reducer → function that updates state
4. Action → tells what to do
5. useSelector → get data from store
6. useDispatch → send action to store
7. Provider → gives store to entire app
*/

import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

/*
========================================
SLICE (STATE + LOGIC)
========================================
*/
const counterSlice = createSlice({
    name: "counter",

    // initial state
    initialState: {
        value: 0
    },

    // reducers → update state
    reducers: {
        increment: (state) => {
            state.value += 1; // redux toolkit allows direct update
        },
        decrement: (state) => {
            state.value -= 1;
        },
        reset: (state) => {
            state.value = 0;
        }
    }
});

// export actions
const { increment, decrement, reset } = counterSlice.actions;

/*
========================================
STORE
========================================
*/
const store = configureStore({
    reducer: {
        counter: counterSlice.reducer
    }
});

/*
========================================
MAIN APP
========================================
*/
function App() {
    return (
        /*
          Provider → makes store available everywhere
        */
        <Provider store={store}>
            <div style={{ padding: "20px" }}>
                <h2>Redux Example</h2>
                <Counter />
            </div>
        </Provider>
    );
}

/*
========================================
COMPONENT USING REDUX
========================================
*/
function Counter() {
    /*
      useSelector → get value from store
    */
    const count = useSelector((state) => state.counter.value);

    /*
      useDispatch → send actions
    */
    const dispatch = useDispatch();

    return (
        <div>
            <h3>Count: {count}</h3>

            {/* Dispatch actions */}
            <button onClick={() => dispatch(increment())}>
                Increment
            </button>

            <button onClick={() => dispatch(decrement())}>
                Decrement
            </button>

            <button onClick={() => dispatch(reset())}>
                Reset
            </button>
        </div>
    );
}

export default App;