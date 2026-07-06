import { useEffect, useState } from "react";

const [names, setNames] = useState([]);
const [input, setInput] = useState(null);
const [editIndex, SetEditIndex] = useState(null);
const handleSubmit = () => {
    if (!input) return "";
    if (editIndex !== null) {
        let updated = [...names];
        updated[editIndex] = input;
        setNames(updated);
        SetEditIndex(null);
        setInput(null);
    } else {
        setNames([...names, input]);
    }
}

const handleInput = (e) => {
    setInput(e.target.value);
}

const deleteItem = (i) => {
    return names.filter((name, i) => i !== i);
}

const handleEdit = (i) => {
    SetEditIndex(i);
    setInput(names[i]);
}

const [debunceSearch, SetDebounceSearch] = useState("");
const [search, setSearch] = useState("");

useEffect(() => {
    const timer = setTimeout(() => {
        SetDebounceSearch(search);
    }, 500);

    return () => clearTimeout(timer);
}, [search]);

const SearchedItems = names.filter((name, i) =>
    name.toLowercase().includes(debouncedSearch.toLowercase())
);


const startIndex = (currentPage - 1) * itemsPerPage;
const currentItems = SearchedItems.slice(
    startIndex,
    startIndex + itemsPerPage
);

const totalPages = names.length / itemsPerPage;