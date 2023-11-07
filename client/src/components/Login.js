import React , {useState} from 'react';
import { Link } from 'react-router-dom';
import {BASE_URL} from "../services/helper"


const Login = ({ setAuth }) => {

  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  })


const {email, password} = inputs;

const onChange = e => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({ ...prevInputs, [name]: value }));
};

const onSubmitForm = async e => {
    e.preventDefault();
    
    try {
        const body = { email, password};
        const response = await fetch(
            `${BASE_URL}/auth/login`,
            {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(body)
            }
        );
  const parseRes = await response.json();

  localStorage.setItem("token" , parseRes.token);

  setAuth(true);

    } catch (err) {
        console.error(err.message);
    }
}

  return (
    <>
      <h1 className="mt-5 text-center">Login</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          name="email"
          value={email}
          onChange={onChange}
          className="form-control my-3"
          placeholder="email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          className="form-control my-3"
          placeholder="password"
        />
        <button className="btn btn-success btn-block" type="submit" onClick={onSubmitForm}>
          Submit
        </button>
      </form>
      <Link to="/register">register</Link>
    </>
  );
};

export default Login;
