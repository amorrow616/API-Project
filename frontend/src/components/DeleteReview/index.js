import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import * as spotReviews from '../../store/reviews';
import * as spotActions from '../../store/spots';
import './DeleteReview.css';

export default function DeleteReview(props) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const reviewId = props.props;
    const spotId = useSelector((state) => state.spots.singleSpot.id)

    const reviewDelete = async (e, reviewId) => {
        e.preventDefault();
        await dispatch(spotReviews.deleteReviewThunk(reviewId));
        await dispatch(spotActions.fetchOneSpot(spotId));
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
