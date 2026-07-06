import { React, useState } from "react";

let PaginationPage = () => {
    const [data, setData] = useState([]);
    const [input, SetInput] = useState("");

    const addItem = () => {
        if (input.trim() === "") return;
        setData([...data, input]);
        SetInput("");
    }
    const handleChange = (e) => {
        SetInput(e.target.value);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = data.slice(startIndex, startIndex + itemsPerPage);



    return (
        <>
            <div>
                <input type="text" value={input} onChange={handleChange} />
                <button type="submit" onClick={addItem}>Create</button>
            </div>
            <div>
                {currentItems.map((d, i) => (
                    <div key={i}>{d}</div>
                ))}
            </div>

            <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            <span>
                {currentPage}
            </span>
            <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage == totalPages}
            >
                Next
            </button>
        </>

    )
}

export default PaginationPage;