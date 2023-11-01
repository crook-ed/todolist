import React , {useState} from 'react';
import { Link } from 'react-router-dom';


const Register = ({setAuth}) => {

    const [inputs, setInputs] = useState({
        email : "",
        password: "",
        name: ""
    });

    const {email, name, password} = inputs;

    const onChange = e => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({ ...prevInputs, [name]: value }));
    };

    const onSubmitForm = async e => {
        e.preventDefault();
        
        try {
            const body = { email, password, name };
            const response = await fetch(
                "http://localhost:5000/auth/register",
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
            <h1>Register</h1>
            <form onSubmit={onSubmitForm}>
            <input
                type="text"
                name="email"
                value={email}
                placeholder="email"
                onChange={onChange}
                className="form-control my-3"
            />
            <input
                type="password"
                name="password"
                value={password}
                placeholder="password"
                onChange={onChange}
                className="form-control my-3"
            />
            <input
                type="text"
                name="name"
                value={name}
                placeholder="name"
                onChange={onChange}
                className="form-control my-3"
            />
            <button type="submit" className="btn btn-success btn-block">
                Submit
            </button>
            </form>
            <Link to="/login">login</Link>
        </>
    );
};

export default Register;