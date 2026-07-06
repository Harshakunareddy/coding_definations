/*
========================================
REACT ROUTING FULL (INTERVIEW READY)
========================================

1. BrowserRouter → wraps app
2. Routes → group of routes
3. Route → path + component
4. Link → navigation without reload
5. useNavigate → navigate using function
6. useParams → get dynamic values
7. Nested Routes → child routes inside parent
8. Outlet → where child renders
9. Protected Route → restrict access
10. "*" → 404 page
*/

import React, { useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useNavigate,
    useParams,
    Outlet,
    Navigate
} from "react-router-dom";

/*
  PROTECTED ROUTE COMPONENT
  If user not logged in → redirect to login
*/
function ProtectedRoute({ isAuth, children }) {
    if (!isAuth) {
        return <Navigate to="/login" />; // redirect
    }
    return children;
}

function App() {
    /*
      SIMPLE AUTH STATE
    */
    const [isAuth, setIsAuth] = useState(false);

    return (
        <BrowserRouter>
            <div style={{ padding: "20px" }}>
                <h2>React Routing Advanced</h2>

                {/* NAVIGATION */}
                <nav>
                    <Link to="/">Home</Link> |{" "}
                    <Link to="/dashboard">Dashboard</Link> |{" "}
                    <Link to="/user/101">User</Link> |{" "}
                    <Link to="/login">Login</Link>
                </nav>

                <hr />

                <Routes>

                    {/* NORMAL ROUTES */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />

                    {/* DYNAMIC ROUTE */}
                    <Route path="/user/:id" element={<User />} />

                    {/* PROTECTED + NESTED ROUTES */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute isAuth={isAuth}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    >
                        {/* NESTED ROUTES */}
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />

                </Routes>
            </div>
        </BrowserRouter>
    );
}

/*
  HOME
*/
function Home() {
    return <h3>Home Page</h3>;
}

/*
  LOGIN PAGE
*/
function Login({ setIsAuth }) {
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsAuth(true);
        navigate("/dashboard"); // go to dashboard after login
    };

    return (
        <div>
            <h3>Login Page</h3>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

/*
  DASHBOARD (PARENT)
  Outlet is important for nested routes
*/
function Dashboard() {
    return (
        <div>
            <h3>Dashboard</h3>

            {/* LINKS FOR NESTED ROUTES */}
            <Link to="profile">Profile</Link> |{" "}
            <Link to="settings">Settings</Link>

            <hr />

            {/* CHILD ROUTES RENDER HERE */}
            <Outlet />
        </div>
    );
}

/*
  CHILD COMPONENTS
*/
function Profile() {
    return <p>Profile Page</p>;
}

function Settings() {
    return <p>Settings Page</p>;
}

/*
  DYNAMIC ROUTE
*/
function User() {
    const { id } = useParams();
    return <h3>User ID: {id}</h3>;
}

/*
  404
*/
function NotFound() {
    return <h3>404 - Page Not Found</h3>;
}

export default App;