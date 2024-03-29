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

    if (!Object.values(spots)) return null;
    return (
        <>
            <ul className='gridArea'>
                {Object.values(spots).map((spot) => (
                    <li key={spot.id} className="homePageSpots">
                        <Link to={`/spots/${spot.id}`} id='spotLink'>
                            <img className='spotImage' src={spot.previewImage && spot.previewImage} alt='a preview of the spot you can book' title={spot.name}></img>
                            <div className='spotLocation'>{spot.city && spot.city}, {spot.state && spot.state}</div>
                            <div className='spotRating'><i class='fa-solid fa-star' /> {spot.avgRating ? Math.round(spot.avgRating * 10) / 10 : 'New'}</div>
                            <div className='spotPrice'><b>${spot.price && spot.price}</b> night</div>
                        </Link>
                    </li>
                ))}
            </ul >
        </>
    )
};
