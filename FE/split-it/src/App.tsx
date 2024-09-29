import React, { useState } from "react";
import "./App.css";
import {
    Route,
    BrowserRouter as Router,
    Routes,
    Navigate,
} from "react-router-dom";
import Login from "./Components/Login";
import AppNavbar from "./Components/AppNavbar";
import Dashboard from "./Components/Dashboard";
// @ts-ignore
import { UserProvider } from './utils/userContext.js';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") ? true : false
    );

    return (
        <UserProvider>
            <Router>
                <AppNavbar isLoggedIn={isLoggedIn} />
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />}></Route>
                    <Route
                        path="/dashboard"
                        element={
                            <Dashboard isLoggedIn setIsLoggedIn={setIsLoggedIn} />
                        }
                    ></Route>
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
