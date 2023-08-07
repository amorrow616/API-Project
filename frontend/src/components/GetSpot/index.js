import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CreateReview from '../CreateReview';
import DeleteReview from '../DeleteReview';
import * as spotActions from '../../store/spots';
import * as reviewActions from '../../store/reviews';
import './GetSpot.css';

export default function GetSpot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot);
    const reviews = useSelector((state) => state.reviews.spot);
    const sessionUser = useSelector((state) => state.session.user);
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const hidePostButton = () => {
        if (!sessionUser) {
            return '';
        } else if (spot.ownerId === sessionUser.id) {
            return '';
        } else {
            return (
                <button className='manageSpotButtons'><OpenModalMenuItem
                    itemText='Post Your Review'
                    modalComponent={<CreateReview spotId={spot.id} />}
                /></button>
            )
        }
    };

    useEffect(() => {
        dispatch(spotActions.fetchOneSpot(spotId));
        dispatch(reviewActions.findSpotReviewsThunk(spotId));
    }, [dispatch, spotId]);


    const convertMonth = (number) => {
        if (number === '01') {
            return 'January'
        }
        if (number === '02') {
            return 'February'
        }
        if (number === '03') {
            return 'March'
        }
        if (number === '04') {
            return 'April'
        }
        if (number === '05') {
            return 'May'
        }
        if (number === '06') {
            return 'June'
        }
        if (number === '07') {
            return 'July'
        }
        if (number === '08') {
            return 'August'
        }
        if (number === '09') {
            return 'September'
        }
        if (number === '10') {
            return 'October'
        }
        if (number === '11') {
            return 'November'
        }
        if (number === '12') {
            return 'December'
        }
    };


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
                        {spot.numReviews ? <i class="fa-solid fa-circle" id='detailsCircle1'></i> : ''}
                        {spot.numReviews && +spot.numReviews === 1 ? <div id='detailReviews'>{spot.numReviews && spot.numReviews} review</div> :
                            +spot.numReviews > 1 ? <div id='detailReviews'>{spot.numReviews && spot.numReviews} reviews</div> :
                                spot.numReviews = ''}
                        <button onClick={reserveButton} id='detailsButton'>Reserve</button>
                    </div>
                </div>
                <hr />
                <h3 id='reviewsHeading'><i class='fa-solid fa-star' />{spot.avgStarRating ? Math.round(spot.avgStarRating * 10) / 10 : 'New'}{spot.numReviews ? <i class="fa-solid fa-circle" id='detailsCircle'></i> :
                    ''}{spot.numReviews && +spot.numReviews === 1 ? <div id='detailReviews'>{spot.numReviews && spot.numReviews} review</div> :
                        +spot.numReviews > 1 ? <div id='detailReviews'>{spot.numReviews && spot.numReviews} reviews</div> :
                            spot.numReviews = ''}</h3>
                {hidePostButton()}
                {!spot.numReviews && spot.ownerId !== sessionUser.id ? <h3>Be the first to post a review!</h3> : <ul>
                    {Object.values(reviews).map((review) => (
                        <li key={review.id}>
                            <div id='fullReview'>
                                <div id='reviewName'>{review.User && review.User.firstName}</div>
                                <div id='reviewDate'>{review.createdAt && convertMonth(review.createdAt.slice(5, 7))} {parseInt(review.createdAt)}</div>
                                <div id='reviewText'>{review.review && review.review}</div>
                                {sessionUser && review.userId === sessionUser.id ? <button onClick={openMenu} className='manageSpotButtons'> <OpenModalMenuItem
                                    itemText='Delete'
                                    modalComponent={<DeleteReview props={review.id} />}
                                /></button> : ''}
                            </div>
                        </li>
                    )).reverse()}
                </ul>}
            </div >
        </>
    )
};
