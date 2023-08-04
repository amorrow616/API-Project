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

    if (spots === undefined) return null;
    return (
        <>
            <ul className='gridArea'>
                {Object.values(spots).map((spot) => (
                    <li key={spot.id}>
                        <Link to={`/spots/${spot.id}`} id='spotLink'>
                            <img className='spotImage' src={spot.previewImage} alt='a preview of the spot you can book' title={spot.name}></img>
                            <span className='spotLocation'>{spot.city}, {spot.state}</span>
                            <span className='spotRating'><i class='fa-solid fa-star' /> {spot.avgRating || 'New'}</span>
                            <div className='spotPrice'>${spot.price} night</div>
                        </Link>
                    </li>
                ))}
            </ul >
        </>
    )
};
