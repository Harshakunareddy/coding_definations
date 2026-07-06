/*
===============================
REACT LIFECYCLE (Simple 10 Points)
===============================

1. Component is created (function runs)
2. useState sets initial values
3. JSX is returned (UI ready)
4. Component renders on screen
5. useEffect runs after render
6. If state/props change → re-render happens
7. useMemo/useCallback optimize performance
8. useRef stores values without re-render
9. Cleanup runs (component unmount / before next effect)
10. Component removed from screen (unmount)

===============================
REAL PROJECT: TODO APP
===============================
*/

import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
    useContext,
    createContext
} from "react";

/*
  CONTEXT → used to share theme across components
*/
const ThemeContext = createContext();

/*
  CUSTOM HOOK → reuse logic
  This hook handles fetching data (simulated API)
*/
function useFetchTodos() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        // simulate API call
        const timer = setTimeout(() => {
            setTodos([
                { id: 1, text: "Learn React", completed: false },
                { id: 2, text: "Build Project", completed: false }
            ]);
        }, 1000);

        // cleanup
        return () => clearTimeout(timer);
    }, []);

    return todos;
}

function App() {
    /*
      STATE → store todos + input + search
    */
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");

    /*
      CUSTOM HOOK usage
    */
    const todos = useFetchTodos();

    /*
      REF → access input directly
    */
    const inputRef = useRef();

    const focusInput = () => {
        inputRef.current.focus();
    };

    /*
      MEMO → filter todos efficiently
    */
    const filteredTodos = useMemo(() => {
        console.log("Filtering...");
        return todos.filter(todo =>
            todo.text.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, todos]);

    /*
      CALLBACK → prevent function recreation
    */
    const addTodo = useCallback(() => {
        if (!input) return;

        todos.push({
            id: Date.now(),
            text: input,
            completed: false
        });

        setInput("");
    }, [input, todos]);

    /*
      EFFECT → log changes
    */
    useEffect(() => {
        console.log("Todos updated");
    }, [todos]);

    return (
        <ThemeContext.Provider value="dark">
            <div style={{ padding: "20px" }}>
                <h2>Todo App (All Hooks)</h2>

                {/* INPUT */}
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add todo"
                />
                <button onClick={addTodo}>Add</button>
                <button onClick={focusInput}>Focus</button>

                {/* SEARCH */}
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search todo"
                />

                {/* LIST */}
                <TodoList todos={filteredTodos} />
            </div>
        </ThemeContext.Provider>
    );
}

/*
  CHILD COMPONENT → uses Context
*/
function TodoList({ todos }) {
    const theme = useContext(ThemeContext);

    return (
        <div>
            <h3>Theme: {theme}</h3>

            {todos.map((todo) => (
                <p key={todo.id}>{todo.text}</p>
            ))}
        </div>
    );
}

export default App;