import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CreateReview from '../CreateReview';
import * as spotActions from '../../store/spots';
import * as reviewActions from '../../store/reviews';
import './GetSpot.css';

export default function GetSpot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot);
    const reviews = useSelector((state) => state.reviews.spot);

    useEffect(() => {
        dispatch(spotActions.fetchOneSpot(spotId));
    }, [dispatch, spotId]);

    useEffect(() => {
        dispatch(reviewActions.findSpotReviewsThunk(spotId));
    }, [dispatch, spotId]);

    if (!spot.id) return null;
    if (!Object.values(reviews)) return null;

    const reserveButton = () => {
        alert('Feature coming soon');
    }
    return (
        <>
            <div className='spotPage'>
                <h1 id='spotName'>{spot.name && spot.name}</h1>
                <div>{spot.city && spot.city}, {spot.state && spot.state}, {spot.country && spot.country}</div>
                <div className='detailImages'>
                    <img src={spot.SpotImages && spot.SpotImages[0].url} alt='preview of the spot' id='prevImg'></img>
                    <img src={spot.SpotImages && spot.SpotImages[1].url} id='detailImage2' alt='a view of the home'></img>
                    <img src={spot.SpotImages && spot.SpotImages[2].url} id='detailImage3' alt='a view of the home2'></img>
                    <img src={spot.SpotImages && spot.SpotImages[3].url} id='detailImage4' alt='a view of the home3'></img>
                    <img src={spot.SpotImages && spot.SpotImages[4].url} id='detailImage5' alt='a view of the home4'></img>
                </div>
                <div className='bottomDetail'>
                    <h2 id='detailName'>Hosted by {spot.Owner && spot.Owner.firstName} {spot.Owner && spot.Owner.lastName}</h2>
                    <div id='detailDescription'>{spot.description && spot.description}</div>
                    <div className='reserveBox'>
                        <div id='detailPrice'>${spot.price && spot.price} night</div>
                        <div id='detailRating'><i class='fa-solid fa-star' />{spot.avgStarRating ? Math.round(spot.avgStarRating * 10) / 10 : 'New'}</div>
                        <div id='detailReviews'>{spot.numReviews && spot.numReviews} reviews</div>
                        <button onClick={reserveButton} id='detailsButton'>Reserve</button>
                    </div>
                </div>
                <hr />
                <h3><i class='fa-solid fa-star' />{spot.avgStarRating ? Math.round(spot.avgStarRating * 10) / 10 : 'New'} ~ {spot.numReviews && spot.numReviews} reviews</h3>
                <button className='manageSpotButtons'><OpenModalMenuItem
                    itemText='Post Your Review'
                    modalComponent={<CreateReview props={spot.id} />}
                /></button>
                <ul>
                    {Object.values(reviews).forEach((review) => {
                        <li key={review.id}>
                            <div>{review.User && review.User.firstName}</div>
                            <div>{review.createdAt && review.createdAt}</div>
                            <div>{review.review && review.review}</div>
                        </li>
                    })}
                </ul>
            </div >
        </>
    )
};
