import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as sessionActions from '../../store/session';

export default function LoginFormPage() {
    const dispatch = useDispatch(); // how to make the action work
    const sessionUser = useSelector((state) => state.session.user); // how to pull data from the store
    const [credential, setCredential] = useState(''); // set the credentials to an empty string
    const [password, setPassword] = useState(''); // set the password to an empty string
    const [errors, setErrors] = useState({}); // set errors to an empty object

    if (sessionUser) return <Redirect to='/' />; // redirect to home once logged in

    const handleSubmit = (e) => {
        e.preventDefault(); // stop the page from refreshing when form is submitted
        setErrors({});
        return dispatch(sessionActions.login({ credential, password })).catch(
            async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors) // if any errors occur during login, set them to the setErrors object
            }
        );
    };
    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input
                        type='text'
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.credential && <p>{errors.credential}</p>}
                <button type='submit'>Log In</button>
            </form>
        </>
    );
};
