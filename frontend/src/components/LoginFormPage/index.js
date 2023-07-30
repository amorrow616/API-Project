import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './LoginForm.css';

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
            <h1>Welcome to Waterbnb</h1>
            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    {/* Username or Email */}
                    <input
                        type='text'
                        placeholder='Username or Email'
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    {/* Password */}
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <p>If you'd like to sign in using your phone number, that's just too bad.</p>
                {errors.credential && <p>{errors.credential}</p>}
                <button type='submit' className='loginButton'>Log In</button>
            </form>
        </>
    );
};
