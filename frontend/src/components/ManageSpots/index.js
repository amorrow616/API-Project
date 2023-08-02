import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import * as spotActions from '../../store/spots';

export default function ManageSpots() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots.spots);

    useEffect(() => {
        dispatch(spotActions.fetchUserSpots());
    }, [dispatch]);

    if (!spots) return null;
    return (
        <>
            <h1>Manage Your Spots</h1>
            {Object.keys(spots) > 0 ? (
                <>
                    <button>Create a New Spot</button>
                    <ul className='gridArea'>
                        {Object.values(spots).map((spot) => (
                            <li key={spot.id} className='spotsList'>
                                <NavLink to={`/spots/${spot.id}`} id='spotLink'>
                                    <img className='spotImage' src={spot.previewImage} alt='a preview of the spot you can book' title={spot.name}></img>
                                    <div className='spotLocation'>{spot.city}, {spot.state}</div>
                                    <div className='spotRating'><i class='fa-solid fa-star' /> {spot.avgRating || 'New'}</div>
                                    <div className='spotPrice'>${spot.price} night</div>
                                    <button>Update</button>
                                    <button>Delete</button>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    <NavLink to='/spots'>Create a New Spot</NavLink>
                </>
            )}
        </>
    )
}
