import { csrfFetch } from "./csrf";

// to help with typos
const GET_SPOTS = '/spots/GET_SPOTS';
const FIND_SPOT = '/spots/FIND_SPOT';
const USER_SPOTS = '/spots/USER_SPOTS';
const DELETE_SPOT = '/spots/DELETE_SPOT';
const CREATE_SPOT = '/spots/CREATE_SPOT';

// action for getting all spots
export const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
};

// action for finding specific spot base on params
export const findSpot = (spot) => {
    return {
        type: FIND_SPOT,
        spot
    }
};

export const userSpots = (spots) => {
    return {
        type: USER_SPOTS,
        spots
    }
};

// action for deleting a spot
export const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
};

// action for creating a spot
export const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
    }
}

// get all spots thunk
export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const spots = await response.json();

    // if (spots && spots.errors) return console.log(spots.errors);

    const emptyObj = {};
    spots.Spots.map((spot) => {
        return emptyObj[spot.id] = spot;
    }) // this is to flatten the data

    dispatch(getSpots(emptyObj));
};

// get one spot thunk
export const fetchOneSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const spot = await response.json();

    dispatch(findSpot(spot));
};

// get spots for current user thunk
export const fetchUserSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');
    const spots = await response.json();

    const emptyObj = {};
    spots.Spots.map((spot) => {
        return emptyObj[spot.id] = spot;
    });
    console.log(emptyObj)
    dispatch(userSpots(emptyObj));
};

// create spot thunk
export const createSpotThunk = (payload) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(createSpot(spot));
        return spot;
    }
};

// delete spot thunk
export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });
    const spot = response.json();
    console.log(spot)

    if (spot && spot.errors) return console.log(spot.errors);
    dispatch(deleteSpot(spot.spotId));
    return spot;
}

const initialState = {};
// reducer
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS:
            return { ...state, allSpots: { ...action.spots } }
        case FIND_SPOT:
            return { ...state, singleSpot: { ...action.spot } }
        case USER_SPOTS:
            return { ...state, userSpots: { ...action.spots } }
        case DELETE_SPOT:
            const newState = { ...state };
            delete newState[action.reportId];
            return { ...newState };
        case CREATE_SPOT:
            return { ...state, newSpot: { ...action.spot } }
        default:
            return state;
    }
};

export default spotsReducer;
