import { csrfFetch } from "./csrf";

// to help with typos
const SPOT_SLICE = '/reviews/SPOT_SLICE';
const USER_SLICE = '/reviews/USER_SLICE';
const DELETE_REVIEW = '/reviews/DELETE_REVIEW';

// action for getting single spot reviews
export const findSpotReviews = (spotReviews) => {
    return {
        type: SPOT_SLICE,
        spotReviews
    }
};

// action for getting users reviews
export const findUserReviews = (userReviews) => {
    return {
        type: USER_SLICE,
        userReviews
    }
};

// action for deleting a review
export const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        reviewId
    }
};

// get all reviews for one spot thunk
export const findSpotReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const spot = await response.json();

    const emptyObj = {};
    spot.Reviews.map((review) => {
        return emptyObj[review.id] = review;
    });

    dispatch(findSpotReviews(emptyObj));
};

// get all reviews for current user thunk
export const findUserReviewsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/reviews/current');
    const reviews = await response.json();

    const emptyObj = {};
    reviews.Reviews.map((review) => {
        return emptyObj[review.id] = review;
    })

    dispatch(findUserReviews(emptyObj));
};

// create a review thunk
export const createReviewThunk = (payload, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(findSpotReviews(review));
        return review;
    }
};

// delete a review thunk
export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    const review = await response.json();

    dispatch(deleteReview(reviewId));
    return review;
}

const initialState = { spot: {}, user: {} };

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SPOT_SLICE:
            newState = Object.assign({}, state);
            newState.spot = action.spotReviews;
            return newState;
        case USER_SLICE:
            newState = Object.assign({}, state);
            newState.user = action.userReviews;
            return newState;
        case DELETE_REVIEW:
            const newRef = { ...state.spot };
            delete newRef[action.reviewId];
            const newInfo = { ...state, spot: { ...newRef } };
            return newInfo;
        default:
            return state;
    }
};

export default reviewsReducer;
