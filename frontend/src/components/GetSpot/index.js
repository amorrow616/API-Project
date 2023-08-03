import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as spotActions from '../../store/spots';
import './GetSpot.css';

export default function GetSpot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot);

    useEffect(() => {
        dispatch(spotActions.fetchOneSpot(spotId));
    }, [dispatch, spotId]);

    if (spot === undefined) return null;

    const reserveButton = () => {
        alert('Feature coming soon');
    }
    return (
        <>
            <h1 id='spotName'>{spot.name && spot.name}</h1>
            <div>{spot.city && spot.city}, {spot.state && spot.state}, {spot.country && spot.country}</div>
            <img src={spot.SpotImages.length && spot.SpotImages[0].url} alt='preview of the spot' id='prevImg'></img>
            <h2>Hosted by {spot.Owner.firstName && spot.Owner.firstName} {spot.Owner.lastName && spot.Owner.lastName}</h2>
            <div>{spot.description && spot.description}</div>
            <div>${spot.price && spot.price} night</div>
            <div>{spot.avgStarRating && spot.avgStarRating}</div>
            <div>{spot.numReviews && spot.numReviews} reviews</div>
            <button onClick={reserveButton}>Reserve</button>
            <h3>Reviews will go here</h3>
        </>
    )
};
