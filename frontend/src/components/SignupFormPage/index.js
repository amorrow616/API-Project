import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

export default function SignupFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user); // pull the session user from the store
    const [email, setEmail] = useState(''); // set everything to an empty string
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({}); // the errors must be an empty object

    if (sessionUser) return <Redirect to='/' />; // send them to the home page once signed up

    const handleSubmit = (e) => {
        e.preventDefault(); // stop the form from reloading the page when submitted
        if (password === confirmPassword) { // need to make sure both fields match
            setErrors({});
            return dispatch(sessionActions.signup({
                email, // syntactic sugar for email: email, or setting the email to the email submitted
                username,
                firstName,
                lastName,
                password
            })
            ).catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors) // if there are errors from the data, set them to the errors object
                }
            });
        }
        return setErrors({
            confirmPassword: 'Confirm Password field must be the same as the Password field'
        });
    };
    return (
        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} className='signupForm'>
                <label>
                    <input
                        type='text'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {errors.email && <p>{errors.email}</p>}
                <label>
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                {errors.username && <p>{errors.username}</p>}
                <label>
                    <input
                        type='text'
                        placeholder='First Name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                {errors.firstName && <p>{errors.firstName}</p>}
                <label>
                    <input
                        type='text'
                        placeholder='Last Name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                {errors.lastName && <p>{errors.lastName}</p>}
                <label>
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.password && <p>{errors.password}</p>}
                <label>
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                <button type='submit' className='signupSubmit'>Sign Up</button>
            </form>
        </>
    )
};
