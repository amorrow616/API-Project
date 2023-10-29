import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CreateReview from '../CreateReview';
import DeleteReview from '../DeleteReview';
import UpdateReview from '../UpdateReview';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as spotActions from '../../store/spots';
import * as reviewActions from '../../store/reviews';
import * as bookingActions from '../../store/bookings';
import './GetSpot.css';

export default function GetSpot() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot);
    const reviews = useSelector((state) => state.reviews.spot);
    const sessionUser = useSelector((state) => state.session.user);
    const [showMenu, setShowMenu] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(() => {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 5);
        return futureDate;
    });
    const [errors, setErrors] = useState({});

    const hidePostButton = () => {
        if (!sessionUser) {
            return '';
        } else if (spot.ownerId === sessionUser.id) {
            return '';
        } else if (Object.values(reviews).some((review) => review.userId === sessionUser.id)) {
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
    }, [dispatch, spotId, reviews.spot]);


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

    const setToMidnight = (date) => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
        return newDate;
    }; // having issues where date would be one day ahead of chosen date, this function is to fix that

    const reserveButton = async (e) => {
        e.preventDefault();
        const newBooking = {
            startDate,
            endDate
        }

        const returnFromThunk = bookingActions.createBookingThunk(newBooking, spotId);
        const createdBooking = await dispatch(returnFromThunk).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors);
            }
        });

        if (createdBooking) {
            history.push('/bookings/current');
        }
    };

    useEffect(() => {
        const errors = {};

        if (startDate < setToMidnight(new Date())) {
            errors.startDate = 'Start date cannot be before today.'
        };

        if (endDate <= startDate) {
            errors.endDate = 'End date cannot be on or before start date.'
        }
        setErrors(errors)
    }, [startDate, endDate]);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    if (!spot.id) return null;
    if (!Object.values(reviews)) return null;
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
                        <div id='detailPrice'><b>${spot.price && spot.price}</b> night</div>
                        <div id='detailRating'><i class='fa-solid fa-star' />{spot.avgStarRating ? Math.round(spot.avgStarRating * 10) / 10 : 'New'}</div>
                        {spot.numReviews && +spot.numReviews === 1 ? <div id='detailReviews'>{spot.numReviews && spot.numReviews} review</div> :
                            +spot.numReviews > 1 ? <div id='detailReviews'>{spot.numReviews && spot.numReviews} reviews</div> :
                                spot.numReviews = ''}
                        {sessionUser ?
                            sessionUser.id !== spot.ownerId ?
                                <form>
                                    <div id='datesContainer'>
                                        <label>
                                            Check-In
                                            {errors.startDate && <p>{errors.startDate}</p>}
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => setStartDate(setToMidnight(date))}
                                                shouldCloseOnSelect={true}
                                            />
                                        </label>
                                        <label>
                                            Checkout
                                            {errors.endDate && <p>{errors.endDate}</p>}
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(date) => setEndDate(setToMidnight(date))}
                                                shouldCloseOnSelect={true}
                                            />
                                        </label>
                                    </div>
                                    <button onClick={reserveButton} id='detailsButton' disabled={startDate < setToMidnight(new Date()) || endDate <= startDate}>Reserve</button>
                                </form>
                                :
                                <div id='cannotBookBlurb'>Unable to book your own spot.</div>
                            :
                            ''
                        }
                    </div>
                </div>
                <hr />
                <h3 id='reviewsHeading'><i class='fa-solid fa-star' />{spot.avgStarRating ? Math.round(spot.avgStarRating * 10) / 10 : 'New'}{spot.numReviews ? <i class="fa-solid fa-circle" id='detailsCircle'></i> :
                    ''}{spot.numReviews && +spot.numReviews === 1 ? <div id='detailReviews'>{spot.numReviews && spot.numReviews} review</div> :
                        +spot.numReviews > 1 ? <div id='detailReviews'>{spot.numReviews && spot.numReviews} reviews</div> :
                            spot.numReviews = ''}</h3>
                {hidePostButton()}
                {sessionUser && !spot.numReviews && spot.ownerId !== sessionUser.id ? <h3>Be the first to post a review!</h3> : <ul>
                    {Object.values(reviews) && Object.values(reviews).map((review) => (
                        <li key={review.id}>
                            <div id='fullReview'>
                                <div id='reviewName'>{review.User && review.User.firstName}</div>
                                <div id='reviewDate'>{review.createdAt && convertMonth(review.createdAt.slice(5, 7))} {review.createdAt && !isNaN(parseInt(review.createdAt)) ? parseInt(review.createdAt) : 'Review is loading...'}</div>
                                <div id='reviewText'>{review.review && review.review}</div>
                                {sessionUser && review.userId === sessionUser.id ? <button onClick={openMenu} className='manageSpotButtons'> <OpenModalMenuItem
                                    itemText='Update'
                                    modalComponent={<UpdateReview review={review} />}
                                /></button> : ''}
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
