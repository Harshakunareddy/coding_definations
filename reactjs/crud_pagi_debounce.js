import React, {useState, useEffect} from "react";



const Crud = () => {
    const [names, SetNames] = useState([]);
    const [name, SetName] = useState("");
    const [editIndex, SetEditIndex] = useState(null);
    const [searchTerm, SetSearchTerm] = useState("");
    const [debounceTerm, SetDebounceTerm] = useState("");

    const [currentPage, SetCurrentPage] = useState(1);


    const handleChange = (e) => {
        SetName(e.target.value);
    }
    const handleSubmit = () => {
        if(editIndex !== null){
            let a = [...names];
            a[editIndex] = name;
            SetEditIndex(null);
            SetName("");
            SetNames(a);
        }
        else{
            if(!name.trim()) return;
            SetNames([...names, name]);
            SetName("");
        }
    }

    const handleEdit = (i) => {
        SetName(names[i]);
        SetEditIndex(i);
    }

    const handleDelete = (i) => {
        let updatedNames = names.filter((name,key) => i !== key);
        SetNames(updatedNames);
    }

    

    const filteredNames = names.filter((name,key) =>
        name.toLowerCase().includes(debounceTerm.toLowerCase())
    );

    let perPage = 5;


    let startIndex = (currentPage - 1) * perPage;
    let endIndex = startIndex + perPage;
    const paginatedNames = filteredNames.slice(startIndex, endIndex);

    // const totalPages = Math.ceil(filteredNames.length / perPage);
    const totalPages = Math.max(1, Math.ceil(filteredNames.length / perPage));
    


    useEffect(()=>(
        const timer = setTimeout(() => {
            SetDebounceTerm(searchTerm);
        }, 3000);
        return () => clearTimeout(timer);
    ),[searchTerm]);

    useEffect(() => {
        SetCurrentPage(1);
    }, [debounceTerm]);

    return (
        <>
            <div>
                <input 
                    type="text"
                    placeholder="Search Name"
                    value={searchTerm || ""}
                    onChange={(e) => SetSearchTerm(e.target.value)}  
                />
            </div>
            <div>
                <input 
                    value={name || ""}
                    onChange={handleChange}
                    type="text" placeholder="Enter Name" />
                {/* <button onClick={() => handleSubmit()}>Add</button> */}
                <button onClick={() => handleSubmit()}>
                    {editIndex !== null ? "Update" : "Add"}
                </button>
            </div>
            {paginatedNames.map((name,i)=>(
                <div key={startIndex + i}>
                    <li>{name}</li>
                    <button onClick={()=>handleEdit(startIndex + i)}>Edit</button>
                    <button onClick={()=>handleDelete(startIndex + i)}>Delete</button>
                </div>
            ))}

            <div align="right">
                <button disabled={currentPage == 1} onClick={()=>SetCurrentPage((prev) => prev - 1)}>Prev</button>
                <button>Page {currentPage} of {totalPages}</button>
                <button disabled={totalPages == currentPage} onClick={()=>SetCurrentPage((prev) => prev + 1)}>Next</button>
            </div>

            <div>
                Total Records: {filteredNames.length}
            </div>
        </>
    )
}

export default Crud;