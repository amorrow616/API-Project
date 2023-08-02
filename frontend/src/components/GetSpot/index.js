import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as spotActions from '../../store/spots';
import './GetSpot.css';

export default function GetSpot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.spot);

    useEffect(() => {
        dispatch(spotActions.fetchOneSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot) return null;

    const reserveButton = () => {
        alert('Feature coming soon');
    }
    return (
        <>
            <h1>{spot.name}</h1>
            <div>{spot.city}, {spot.state}, {spot.country}</div>
            {/* <img src={spot.SpotImages} alt='preview of the spot'></img> */}
            <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
            <div>${spot.price} night</div>
            <div>{spot.avgStarRating}</div>
            <div>{spot.numReviews} reviews</div>
            <button onClick={reserveButton}>Reserve</button>
            <h3>Reviews will go here</h3>
        </>
    )
};
