import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { FaStar } from 'react-icons/fa';
import * as reviewActions from '../../store/reviews';
import * as spotActions from '../../store/spots';
import './CreateReview.css';

export default function CreateReview({ spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [hover, setHover] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReview = {
            review,
            stars
        };
        const returnFromThunk = reviewActions.createReviewThunk(newReview, spotId);
        return dispatch(returnFromThunk).then(() => {
            dispatch(reviewActions.findSpotReviewsThunk(spotId));
            dispatch(spotActions.fetchOneSpot(spotId));
            closeModal();
        }).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors)
            }
        });
    };

    return (
        <>
            <div className='reviewModal'>
                <h1>How was your stay?</h1>
                <form onSubmit={handleSubmit}>
                    {errors.message && <p>{errors.message}</p>}
                    <textarea
                        id='reviewTextarea'
                        type='text'
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder='Leave your review here...' />
                    <div id='stars'>
                        {[...Array(5)].map((star, index) => {
                            const currentRating = index + 1;
                            return (
                                <label>
                                    <input
                                        className='starsRadio'
                                        type='radio'
                                        value={currentRating}
                                        onClick={(e) => setStars(e.target.value)}
                                    />
                                    <FaStar className="reviewStars"
                                        id='starMenu'
                                        color={currentRating <= (hover || stars) ? '#ffc107' : '#e4e5e9'}
                                        onMouseEnter={() => setHover(currentRating)}
                                        onMouseLeave={() => setHover(null)}
                                    />
                                </label>
                            )
                        })} Stars
                    </div>
                    <button type='submit' className='signupSubmit' disabled={review.length < 10 || stars === 0}>Submit Your Review</button>
                </form>
            </div>
        </>
    )
}
