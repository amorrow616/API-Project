import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import { useModal } from "../../context/Modal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteSpot from "../DeleteSpot";
import './ManageSpots.css';

export default function ManageSpots() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots.allSpots);
    const { closeModal } = useModal();

    useEffect(() => {
        dispatch(spotActions.fetchUserSpots());
    }, [dispatch]);

    if (spots === undefined) return null;
    return (
        <>
            <h1 id='manageSpotsHeading'>Manage Your Spots</h1>
            {Object.keys(spots).length > 0 ? (
                <>
                    <NavLink to='/spots' id='createButton'>Create a New Spot</NavLink>
                    <ul className='gridArea'>
                        {Object.values(spots).map((spot) => (
                            <li key={spot.id} className='spotsList'>
                                <NavLink to={`/spots/${spot.id}`} id='spotLink'>
                                    <img className='spotImage' src={spot.previewImage} alt='a preview of the spot you can book' title={spot.name}></img>
                                    <div className='spotLocation'>{spot.city}, {spot.state}</div>
                                    <div className='spotRating'><i class='fa-solid fa-star' /> {spot.avgRating || 'New'}</div>
                                    <div className='spotPrice'>${spot.price} night</div>
                                </NavLink>
                                <button className='manageSpotButtons'>Update</button>
                                {/* <OpenModalMenuItem
                                    itemText='Delete'
                                    onItemClick={closeModal}
                                    className='manageSpotButtons'
                                    modalComponent={<DeleteSpot />}
                                /> */}
                                {/* {(e) => spotDelete(e, spot.id)} */}
                                <button className='manageSpotButtons'>Delete</button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    <div>Looks like you don't have any spots! Create one here:</div>
                    <NavLink to='/spots' id='noSpots'>Create a New Spot</NavLink>
                </>
            )}
        </>
    )
}
