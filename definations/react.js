/*
========================================
REACT JS INTERVIEW QUESTIONS (1–20)
WITH SIMPLE EXPLANATIONS + CODE
========================================
*/

/*
1. WHAT IS REACT?
React is a JavaScript library used to build user interfaces.
It uses component-based architecture to create reusable UI.
It follows a virtual DOM approach for better performance.
*/
function App() {
    return <h1>Hello React</h1>;
}


/*
2. WHAT IS JSX?
JSX is syntax that looks like HTML but works inside JavaScript.
It makes UI code easy to read and write.
Under the hood, JSX is converted to React.createElement().
*/
const element = <h1>Hello JSX</h1>;


/*
3. COMPONENTS
Components are reusable pieces of UI.
There are two types: functional and class components.
Modern React mainly uses functional components.
*/
function MyComponent() {
    return <p>Reusable Component</p>;
}


/*
4. PROPS
Props are used to pass data from parent to child.
They are read-only and cannot be modified.
Used for dynamic UI rendering.
*/
function Child(props) {
    return <p>{props.name}</p>;
}


/*
5. STATE
State is used to store dynamic data in a component.
When state changes, component re-renders automatically.
Managed using useState hook.
*/
import { useState } from "react";
const [count, setCount] = useState(0);


/*
6. useEffect
useEffect is used for side effects like API calls.
It runs after component renders.
Dependency array controls when it runs.
*/
import { useEffect } from "react";
useEffect(() => {
    console.log("Rendered");
}, []);


/*
7. VIRTUAL DOM
Virtual DOM is a lightweight copy of real DOM.
React updates only changed parts instead of full reload.
This improves performance.
*/


/*
8. KEYS IN LIST
Keys help React identify elements uniquely.
They improve performance during re-rendering.
Always use unique id, not index.
*/
const list = [1, 2, 3];
list.map(item => <p key={item}>{item}</p>);


/*
9. EVENT HANDLING
React events are similar to DOM events.
But they use camelCase naming.
Functions are passed instead of strings.
*/
<button onClick={() => alert("Clicked")}>Click</button>


/*
10. CONDITIONAL RENDERING
Render UI based on conditions.
We use if, ternary, or && operator.
*/
const isLogged = true;
isLogged ? <p>Welcome</p> : <p>Login</p>;


/*
11. FORMS IN REACT
Forms are controlled using state.
Input value is linked to state.
onChange updates state.
*/
<input value={name} onChange={(e) => setName(e.target.value)} />;


/*
12. LIFTING STATE UP
Moving state to parent component.
Used when multiple components need same data.
Helps maintain single source of truth.
*/


/*
13. useRef
useRef is used to access DOM elements directly.
It does not cause re-render.
Useful for focus, timers, etc.
*/
import { useRef } from "react";
const ref = useRef();
<input ref={ref} />;


/*
14. useMemo
useMemo is used to optimize heavy calculations.
It recalculates only when dependencies change.
Helps improve performance.
*/
import { useMemo } from "react";
const value = useMemo(() => num * 2, [num]);


/*
15. useCallback
useCallback is used to memoize functions.
Prevents unnecessary re-creation of functions.
Useful in performance optimization.
*/
import { useCallback } from "react";
const fn = useCallback(() => console.log("Hi"), []);


/*
16. CONTEXT API
Context is used to share data globally.
Avoids prop drilling.
Used with createContext and useContext.
*/
import { createContext, useContext } from "react";
const MyContext = createContext();


/*
17. ROUTING
Routing is used to navigate between pages.
React Router is commonly used.
It enables SPA navigation without reload.
*/


/*
18. CONTROLLED vs UNCONTROLLED
Controlled → state controls input.
Uncontrolled → useRef controls input.
Controlled is preferred in React.
*/


/*
19. ERROR BOUNDARY
Used to catch JavaScript errors in UI.
Prevents app crash.
Works only in class components.
*/


/*
20. CUSTOM HOOKS
Custom hooks are reusable functions using hooks.
They help reuse logic across components.
Must start with "use".
*/
function useCustom() {
    const [data, setData] = useState(null);
    return data;
}





/*
========================================
END OF FILE
========================================
*/