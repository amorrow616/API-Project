import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

export default function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);
    return (
        <>
            <ul>
                <li id='headerItems'>
                    <NavLink exact to="/" id='homeLink'><i class='fa-solid fa-water' /> Waterbnb</NavLink>
                </li>
                {isLoaded && (
                    <li>
                        <ProfileButton user={sessionUser} />
                    </li>
                )}
            </ul>
            <hr></hr>
        </>
    );
}
