import { useState } from "react";

const App = () => {
    
    const [items, setItems] = useState([]);
    const [item, setItem] = useState("");
    const [age, setAge] = useState("");
    const [EditItem, setEditItem] = useState(null);

    const handleSubmit = (e)=> {
        // e.preventDefault();
        if(EditItem){
            const items_all = [...items];
            // items_all[EditItem] = item;
            items_all[EditItem] = {name: item, age: age};
            setItems(items_all);
            setEditItem(null);
            setItem("");
            setAge("");
        }else{
            const items = [...items, {name: item, age: age}];
            setItems(items);
            setItem("");
            setAge("");
        }
    }

    const handleEdit = (item) => {
        setEditItem(item);
        setItem(items[item].name);
        setAge(items[item].age);
    }

    const handleDelete = (i) => {
        const items = items.filter((item, key)=> key !== i);
        setItems(items);
    }


    return (
        <>
            {items.map((item,index)=>(
                <div key={index}>
                    <p>{item.name}</p>
                    <span
                        onClick={() => handleEdit(index)}
                    >Edit</span>
                    <span 
                        onClick={() => handleDelete(index)}
                    >Delete</span>
                </div>
            ))}

            <div>
                <input 
                    name="item" 
                    value={item || ""}
                    type="text"
                    onChange={(e)=>setItem(e.target.value)}
                />
                <input type="number" 
                    name="age"
                    value={age || ""}
                    onChange={(e)=> setAge(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </>
    )
};

export default App;