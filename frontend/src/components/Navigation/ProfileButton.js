import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton.css';

export default function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const history = useHistory();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
        history.push('/');
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : "-hidden");

    return (
        <>
            {user ? (<NavLink to='/spots' className='header'>Create a New Spot</NavLink>) : (<><div></div></>)}
            <button onClick={openMenu} className='profileButton'>
                <i className='fa-solid fa-bars' />
                <i className="fas fa-user-circle" />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                        <li>Hello, {user.firstName}!</li>
                        <li>{user.email}</li>
                        <hr />
                        <li>
                            <NavLink to='/spots/current' className='manageLink'>Manage Spots</NavLink>
                        </li>
                        <li>
                            <NavLink to='/bookings/current' className='manageLink'>Your Bookings</NavLink>
                        </li>
                        <li>
                            <button onClick={logout} id='logoutButton'>Log Out</button>
                        </li >
                    </>
                ) : (
                    <>
                        <div>
                            <button className='loginSignupButtons'>
                                <OpenModalMenuItem
                                    itemText='Log In'
                                    onItemClick={closeMenu}
                                    modalComponent={<LoginFormModal />}
                                />
                            </button>
                        </div>
                        <div>
                            <button className='loginSignupButtons'>
                                <OpenModalMenuItem
                                    itemText='Sign Up'
                                    onItemClick={closeMenu}
                                    modalComponent={<SignupFormModal />}
                                />
                            </button>
                        </div>
                    </>
                )}
            </ul >
        </>
    );
};
