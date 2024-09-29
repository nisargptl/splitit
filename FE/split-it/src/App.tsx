import React from "react";
import GroupDetails from "./Components/GroupDetails";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./Components/Login";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/dashboard" element={<GroupDetails />}></Route>
            </Routes>
        </Router>
    );
};

export default App;
