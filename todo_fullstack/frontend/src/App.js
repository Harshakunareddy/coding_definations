import { useState } from "react";

const App = () => {

    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('');
    const [age, setAge] = useState('');
    const [editUser, setEditUser] = useState(null);

    const handleChange = (e) => {
        setUser(e.target.value);
    }

    
    const handleChangeAge = (e) => {
        setAge(e.target.value);
    }
    const handleDelete = (index) => {
        const FilteredUsers = users.filter((u) => u.id == index);
        setUsers([...FilteredUsers]);
    }

    const handleUpdate = (index) => {
        setEditUser(index);
        setUser(users[index].name);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editUser !== null){
            let a = [...users];
            a[editUser] = user;
            
            setUsers(a);


            setEditUser(null);
        }
        else{
            console.log("user = ", user);
            setUsers([...users, { age: age, name: user }]);
            console.log("user = 3 ", user);

            setUser('');
        }
    }

    return (
        <>
            <div align="center" style={{ margin:'20px 10px' }}>
                <div>
                    <input type="text" name="user" value={user || ""} onChange={handleChange} />
                    <input type="number" name="age" value={age || ""} onChange={handleChangeAge} />
                    <button onClick={handleSubmit}>submit</button>    
                </div>    
            </div>
            <div>
                {users.map((user,index)=>(
                    <ul key={index}>
                        <li>

                            {user.name}
                            <span style={{ margin:'0px 20px' }} >
                                
                                <button onClick={() => handleUpdate(index)}>Edit</button>
                                <button onClick={() => handleDelete(index)}>delete</button>

                            </span>
                        </li>
                    </ul>
                ))}
            </div>
            
        </>
    )
}
export default App;