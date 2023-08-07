import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as spotReviews from '../../store/reviews';
import './DeleteReview.css';

export default function DeleteReview(props) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const reviewId = props.props;

    const reviewDelete = (e, reviewId) => {
        e.preventDefault();
        dispatch(spotReviews.deleteReviewThunk(reviewId));
        closeModal();
    };
    return (
        <>
            <div className='deleteReview'>
                <h1 id='deleteSpotHead'>Confirm Delete</h1>
                <h2 id='deleteSpotBlurb'>Are you sure you want to delete this review?</h2>
                <button onClick={(e) => reviewDelete(e, reviewId)} id='deleteButton'>Yes (Delete Review)</button>
                <button onClick={closeModal} id='dontDeleteButton'>No (Keep Review)</button>
            </div>
        </>
    )
};
