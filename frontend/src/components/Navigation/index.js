import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


export default function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks; // declaring this so it can be manipulated to our needs
    if (sessionUser) { // if a user is logged in, make a button to log them out
        sessionLinks = (
            <li>
                <ProfileButton user={sessionUser} />
            </li>
        );
    } else {
        sessionLinks = (
            <li>
                <NavLink to='/login' className='loginLink'>Log In</NavLink>
                <NavLink to='/signup' className='signupLink'>Sign Up</NavLink>
            </li>
        );
    }
    return (
        <ul>
            <li>
                <NavLink exact to='/'>Home</NavLink>
            </li>
            {isLoaded && sessionLinks}
        </ul>
    )
};
