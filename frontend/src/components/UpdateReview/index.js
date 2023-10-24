import CreateReview from '../CreateReview';

export default function UpdateReview({ review }) {
    return (
        <CreateReview createdReview={review} formType='Update Review' />
    )
};
