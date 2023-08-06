import { csrfFetch } from "./csrf";

// to help with typos
const SPOT_SLICE = '/reviews/SPOT_SLICE';
const USER_SLICE = '/reviews/USER_SLICE';

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
}

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
export const findUserReviewsThunk = (userId) => async (dispatch) => {
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
        default:
            return state;
    }
};

export default reviewsReducer;
