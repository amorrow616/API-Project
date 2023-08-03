import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import './ManageSpots.css';

export default function ManageSpots() {
    const dispatch = useDispatch();
    const history = useHistory();
    const spots = useSelector((state) => state.spots.allSpots);

    const spotDelete = (e, spotId) => {
        e.preventDefault();
        dispatch(spotActions.deleteSpotThunk(spotId));
        history.push('/');
    };

    useEffect(() => {
        dispatch(spotActions.fetchUserSpots());
    }, [dispatch]);

    if (!spots) return null;
    return (
        <>
            <h1>Manage Your Spots</h1>
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
                                <button>Update</button>
                                <button onClick={(e) => spotDelete(e, spot.id)}>Delete</button>
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
