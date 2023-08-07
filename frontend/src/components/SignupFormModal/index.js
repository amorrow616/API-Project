import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

export default function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    // useEffect(() => {
    //     const errors = {};
    //     if (username.length < 4) {
    //         errors.username = 'Username cannot be less than 4 characters.'
    //     }
    //     if (password.length < 6) {
    //         errors.password = 'Password must be at least 6 characters.'
    //     }
    //     setErrors(errors)
    // }, [username, password]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password,
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };

    return (
        <>
            <div id='signupForm'>
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    {errors.email && <p>{errors.email}</p>}
                    {errors.username && <p>{errors.username}</p>}
                    {errors.firstName && <p>{errors.firstName}</p>}
                    {errors.lastName && <p>{errors.lastName}</p>}
                    {errors.password && <p>{errors.password}</p>}
                    {errors.confirmPassword && (
                        <p>{errors.confirmPassword}</p>
                    )}
                    <label>
                        <input
                            id='signupInput'
                            type="text"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            id='signupInput'
                            type="text"
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            id='signupInput'
                            type="text"
                            placeholder='First Name'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            id='signupInput'
                            type="text"
                            placeholder='Last Name'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            id='signupInput'
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            id='signupInput'
                            type="password"
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit" className='signupSubmit' disabled={
                        Object.keys(errors) > 0 ||
                        email.length < 1 ||
                        username.length < 4 ||
                        firstName.length < 1 ||
                        lastName.length < 1 ||
                        password.length < 6 ||
                        confirmPassword < 1}>Sign Up</button>
                </form>
            </div>
        </>
    );
};
