import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from '../../store/spots';
import './GetAllSpots.css';

export default function GetAllSpots() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots.spots);

    useEffect(() => {
        dispatch(spotActions.fetchSpots());
    }, [dispatch]);

    if (!spots) return null;
    return (
        <>
            <ul className='gridArea'>
                {Object.values(spots).map((spot) => (
                    <li key={spot.id} className='spotsList'>
                        <img className='spotImage' src={spot.previewImage}></img>
                        <div className='spotLocation'>{spot.city}, {spot.state}</div>
                        <div className='spotRating'><i class='fa-solid fa-star' /> {spot.avgRating}</div>
                        <div className='spotPrice'>${spot.price} night</div></li>
                ))}
            </ul>
        </>
    )
};
