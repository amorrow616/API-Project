import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as reviewActions from '../../store/reviews';
import './CreateReview.css';

export default function CreateReview() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(null);
    const [errors, setErrors] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReview = {
            review,
            rating
        };
        const returnFromThunk = reviewActions.createReviewThunk(newReview);
        return dispatch(returnFromThunk).then(closeModal).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors)
            }
        });
    }

    return (
        <>
            <h1>How was your stay?</h1>
            <form onSubmit={handleSubmit}>
                {errors.message && <p>{errors.message}</p>}
                <textarea
                    type='text'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder='Leave your review here...' />
                <div id='stars'>
                    {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1;

                        return (
                            <label>
                                <input
                                    type='radio'
                                    className='starsRadio'
                                    value={ratingValue}
                                    onClick={(e) => setRating(e.target.value)} />
                                <i class='fa-solid fa-star' id='starMenu' color={ratingValue <= rating ? '#ffc107' : '#e4e5e9'} />
                            </label>
                        )
                    })}
                </div>
                <button disabled={review.length < 10 || rating <= 0}>Submit Your Review</button>
            </form>
        </>
    )
}
