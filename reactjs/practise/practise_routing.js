import { useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
    Outlet,
    Link
} from "react-router-dom";

function ProtectedRoute({ isAuth, children }) {
    if (!isAuth) {
        return <Navigate to="/login" />
    }
    return children;
}


const [isAuth, setIsAuth] = useState(false);

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/login" element={<Login />}
                    ></Route>
                </Routes>

                <Route path="/user/:id" element={<User />} />

                <Route path="/dashboard"
                    element={
                        <ProtectedRoute isAuth={isAuth}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                </Route>


                <Route path="*" element={<NotFound />} />

            </BrowserRouter>
        </>
    )
}

const Login = () => {
    return (
        <>
            <h1>Login</h1>
        </>
    )
}

const Dashboard = () => {
    return (
        <>
            <h1>Dashboard</h1>
            <Outlet />
        </>
    )
}

const Profile = () => {
    return (
        <>
            <h1>Profile</h1>
        </>
    )
}

const Settings = () => {
    return (
        <>
            <h1>Settings</h1>
        </>
    )
}

const User = () => {
    return (
        <>
            <h1>User</h1>
        </>
    )
}

const NotFound = () => {
    return (
        <>
            <h1>404 Not Found</h1>
        </>
    )
}

export default App;