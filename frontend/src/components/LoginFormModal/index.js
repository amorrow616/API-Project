import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

export default function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    // useEffect(() => { // setting up a useeffect to show errors anytime a change is made to the credential or password fields until validations are met
    //     const errors = {};
    //     if (credential.length < 4) {
    //         errors.credential = 'Username or email must be longer than 4 characters.'
    //     } else if (password.length < 6) {
    //         errors.credential = 'Password must be longer than 6 characters.'
    //     }
    //     setErrors(errors)
    // }, [credential, password]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    const demoUser = () => {
        dispatch(sessionActions.login({ credential: 'TestUser2', password: 'password2' })).then(closeModal);
    };
    return (
        <>
            <h1 className='loginTitle'>Log In</h1>
            <form onSubmit={handleSubmit} id='loginForm'>
                {errors.credential && (
                    <p>{errors.credential}</p>
                )}
                <label>
                    <input
                        id='loginInput'
                        type="text"
                        placeholder='Username or Email'
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        id='loginInput'
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" className='loginButton' disabled={Object.keys(errors) > 0 || credential.length < 4 || password.length < 6}>Log In</button>
            </form>
            <button onClick={demoUser} className='demoUser'>Demo User</button>
        </>
    );
}
