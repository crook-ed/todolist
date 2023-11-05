import React, {useState , useEffect}  from 'react';
import TodoApp from './todoTable/todoapp';
import {BASE_URL} from "./helpers.js";
const Dashboard = ({setAuth}) => {

    const [name, setName] = useState("");

    const getProfile = async () => {
        try {
          const res = await fetch(`${BASE_URL}/dashboard/`, {
            method: "GET",
            headers: {  token: localStorage.token }
          }); 
    
          const parseData = await res.json();
          console.log(parseData.user_name);
          setName(parseData.user_name);
        } catch (err) {
          console.error(err.message);
        }
      };

      const logout= e => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
      } 

      useEffect(() => {
        getProfile();
      }, []);

    return (
        <>
           <h1 className="mt-5">Dashboard</h1>
      <h2>Welcome {name}</h2>
      <button onClick={logout} className="btn btn-primary">
        Logout
      </button><div>
<TodoApp/></div>
        </>
    );
};

export default Dashboard;