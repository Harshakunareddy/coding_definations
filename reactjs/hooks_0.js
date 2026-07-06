import React, {
    useState,
    useEffect,
    useContext,
    useRef,
    useMemo,
    useCallback,
    createContext
} from "react";

/*
  Create a Context
  Context is used to share data between components
  without passing props manually
*/
const MyContext = createContext();

function App() {
    /*
      1. useState
      Used to store and update data in component
      count = current value
      setCount = function to update value
    */
    const [count, setCount] = useState(0);

    /*
      2. useEffect
      Runs after component renders
      Here it runs every time 'count' changes
    */
    useEffect(() => {
        console.log("Component rendered OR count changed");
    }, [count]); // dependency array

    /*
      3. useRef
      Used to access DOM elements directly
      Also can store value without re-render
    */
    const inputRef = useRef();

    // function to focus input box
    const focusInput = () => {
        inputRef.current.focus();
    };

    /*
      4. useMemo
      Used to optimize heavy calculations
      It only recalculates when 'count' changes
    */
    const expensiveCalculation = useMemo(() => {
        console.log("Calculating...");
        return count * 10;
    }, [count]);

    /*
      5. useCallback
      Used to prevent function recreation
      Helpful for performance optimization
    */
    const handleClick = useCallback(() => {
        console.log("Button clicked");
    }, []);

    return (
        /*
          Providing value to all child components using Context
        */
        <MyContext.Provider value={"Hello from Context"}>
            <div style={{ padding: "20px" }}>
                <h2>React Hooks Example</h2>

                {/* useState example */}
                <p>Count: {count}</p>
                <button onClick={() => setCount(count + 1)}>
                    Increment
                </button>

                {/* useEffect info */}
                <p>Open console to see useEffect logs</p>

                {/* useRef example */}
                <input ref={inputRef} placeholder="Type something" />
                <button onClick={focusInput}>
                    Focus Input
                </button>

                {/* useMemo example */}
                <p>Expensive Value: {expensiveCalculation}</p>

                {/* useCallback example */}
                <button onClick={handleClick}>
                    Click Me
                </button>

                {/* useContext example */}
                <ChildComponent />
            </div>
        </MyContext.Provider>
    );
}

/*
  Child component
  It will consume the Context value
*/
function ChildComponent() {
    /*
      useContext
      Used to access data from Context
    */
    const value = useContext(MyContext);

    return <p>Context Value: {value}</p>;
}

export default App;