/*
========================================
FULL EXAMPLE (INTERVIEW READY)
========================================

FEATURES:
1. CRUD → add, edit, delete names
2. Pagination → show limited items per page
3. Debounce Search → delay search input
4. Clean and simple logic

========================================
IMPORTANT CONCEPTS
========================================

- useState → store data
- useEffect → handle debounce
- slice() → pagination
- map() → render list
*/

import React, { useState, useEffect } from "react";

function App() {
    /*
    ============================
    STATE
    ============================
    */
    const [names, setNames] = useState([
        "Harsha",
        "Ravi",
        "Kiran",
        "Suresh",
        "Anil",
        "Vikram",
        "Teja",
        "Rohit"
    ]);

    const [input, setInput] = useState("");
    const [editIndex, setEditIndex] = useState(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    /*
    ============================
    DEBOUNCE LOGIC
    ============================
  
    Wait 500ms before updating search
    This avoids too many re-renders
    */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        // cleanup → runs before next effect
        return () => clearTimeout(timer);
    }, [search]);

    /*
    ============================
    FILTER DATA (SEARCH)
    ============================
    */
    const filteredNames = names.filter((name) =>
        name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    /*
    ============================
    PAGINATION LOGIC
    ============================
    */
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredNames.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const totalPages = Math.ceil(filteredNames.length / itemsPerPage);

    /*
    ============================
    ADD / UPDATE
    ============================
    */
    const handleAddOrUpdate = () => {
        if (!input) return;

        if (editIndex !== null) {
            // UPDATE
            const updated = [...names];
            updated[editIndex] = input;
            setNames(updated);
            setEditIndex(null);
        } else {
            // ADD
            setNames([...names, input]);
        }

        setInput("");
    };

    /*
    ============================
    EDIT
    ============================
    */
    const handleEdit = (index) => {
        setInput(names[index]);
        setEditIndex(index);
    };

    /*
    ============================
    DELETE
    ============================
    */
    const handleDelete = (index) => {
        const updated = names.filter((_, i) => i !== index);
        setNames(updated);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>CRUD + Pagination + Debounce</h2>

            {/* ADD / EDIT INPUT */}
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter name"
            />
            <button onClick={handleAddOrUpdate}>
                {editIndex !== null ? "Update" : "Add"}
            </button>

            {/* SEARCH INPUT */}
            <br /><br />
            <input
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1); // reset page on search
                }}
                placeholder="Search..."
            />

            {/* LIST */}
            <ul>
                {currentItems.map((name, index) => (
                    <li key={index}>
                        {name}

                        {/* EDIT */}
                        <button onClick={() => handleEdit(index)}>
                            Edit
                        </button>

                        {/* DELETE */}
                        <button onClick={() => handleDelete(index)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            {/* PAGINATION */}
            <div>
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Prev
                </button>

                <span> Page {currentPage} / {totalPages} </span>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}



export default App;