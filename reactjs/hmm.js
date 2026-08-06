import { useState } from "react";

const App = () => {

    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);
    const handleChange = (e) => {
        setUser(e.target.value);
    }
    const handleDelete = (user) => {
        const FilteredUsers = users.filter((u) => u.id == user.id);
        setUsers([...FilteredUsers]);
    }

    return (
        <>
            <div>
                {users.map((user)=>(
                    <p key={user.id}>
                        {user}
                    </p>
                ))}
            </div>
        </>
    )
}
export default App;