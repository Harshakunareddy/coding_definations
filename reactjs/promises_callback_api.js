/*
========================================
ASYNC JAVASCRIPT (SIMPLE THEORY)
========================================

1. Callback → function inside another function
2. Promise → .then() / .catch()
3. async/await → cleaner way of promises
4. fetch → built-in API call
5. axios → external library (better than fetch)

========================================
API USED:
https://jsonplaceholder.typicode.com/users
========================================
*/

import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [users, setUsers] = useState([]);

    /*
    ========================================
    1. CALLBACK STYLE (SIMULATION)
    ========================================
    */
    const getDataWithCallback = (callback) => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((res) => res.json())
            .then((data) => {
                callback(data); // send data to callback
            });
    };

    /*
    ========================================
    2. PROMISE (.then)
    ========================================
    */
    const getDataWithPromise = () => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
            })
            .catch((err) => console.log(err));
    };

    /*
    ========================================
    3. ASYNC / AWAIT (FETCH)
    ========================================
    */
    const getDataAsyncAwait = async () => {
        try {
            const res = await fetch(
                "https://jsonplaceholder.typicode.com/users"
            );
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.log(err);
        }
    };

    /*
    ========================================
    4. AXIOS (BEST PRACTICE)
    ========================================
    */
    const getDataAxios = async () => {
        try {
            const res = await axios.get(
                "https://jsonplaceholder.typicode.com/users"
            );
            setUsers(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    /*
    ========================================
    USE EFFECT → CALL API ON LOAD
    ========================================
    */
    useEffect(() => {
        // Call any one method here

        // 1. Callback
        getDataWithCallback((data) => setUsers(data));

        // 2. Promise
        // getDataWithPromise();

        // 3. Async/Await
        // getDataAsyncAwait();

        // 4. Axios
        // getDataAxios();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>API Calls Example</h2>

            {/* Buttons to test different methods */}
            <button onClick={getDataWithPromise}>
                Promise (.then)
            </button>

            <button onClick={getDataAsyncAwait}>
                Async/Await (fetch)
            </button>

            <button onClick={getDataAxios}>
                Axios
            </button>

            <br /><br />

            {/* DISPLAY DATA */}
            {users.map((user) => (
                <p key={user.id}>
                    {user.name} - {user.email}
                </p>
            ))}
        </div>
    );
}



export default App;

