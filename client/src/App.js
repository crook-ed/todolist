import React, {useState, useEffect} from "react";
import "./App.css";

import Dashboard from "./components/dashboard/Dashboard.js";
import Login from "./components/Login";
import Register from "./components/Register";
import Landing from "./components/Landing";
import {BASE_URL} from "./services/helper.js"


import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Routes,
  Navigate
} from "react-router-dom";
function App() {

    const [isAuthenticated , setIsAuthenticated] = useState(false);

    const setAuth = (boolean) => {
        setIsAuthenticated(boolean);
    }

    async function isAuth() {
        try {
            const response = await fetch(`${BASE_URL}/auth/is-verify`, {
            method: "GET",
            headers: {  token: localStorage.token }
          });
          
          const parseRes = await response.json();

          parseRes === true ? setIsAuthenticated(true): setIsAuthenticated(false);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect (() => {
        isAuth();
    })


    return (
        <>
            <Router>
            <div className="container">
                <Routes>
                <Route path="/" element={!isAuthenticated ? <Landing/> : <Navigate to ="/dashboard"/>} />

                <Route path="/login" element={!isAuthenticated ? <Login setAuth={setAuth}/> : <Navigate to ="/dashboard"/>} />
                <Route path="/register" element={!isAuthenticated ? <Register setAuth={setAuth}/> : <Navigate to ="/dashboard"/> } />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard setAuth={setAuth}/> : <Navigate to ="/login"/>} />
                </Routes>
            </div>
            </Router>
        </>
    );
}

export default App;
