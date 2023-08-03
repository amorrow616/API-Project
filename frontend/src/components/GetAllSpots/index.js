import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from '../../store/spots';
import './GetAllSpots.css';

export default function GetAllSpots() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots.allSpots);

    useEffect(() => {
        dispatch(spotActions.fetchSpots());
    }, [dispatch]);

    if (!spots) return null;
    return (
        <>
            <ul className='gridArea'>
                {Object.values(spots).map((spot) => (
                    <li key={spot.id} className='spotsList'>
                        <Link to={`/spots/${spot.id}`} id='spotLink'>
                            <img className='spotImage' src={spot.previewImage} alt='a preview of the spot you can book' title={spot.name}></img>
                            <div className='spotLocation'>{spot.city}, {spot.state}</div>
                            <div className='spotRating'><i class='fa-solid fa-star' /> {spot.avgRating || 'New'}</div>
                            <div className='spotPrice'>${spot.price} night</div>
                        </Link>
                    </li>
                ))}
            </ul >
        </>
    )
};
