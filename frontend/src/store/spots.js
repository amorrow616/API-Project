import { csrfFetch } from "./csrf";

// to help with typos
const ALL_SPOTS = '/spots/ALL_SPOTS';
const SINGLE_SPOT = '/spots/SINGLE_SPOT';
const DELETE_SPOT = '/spots/DELETE_SPOT';
const CREATE_SPOT = '/spots/CREATE_SPOT';
const SPOT_IMAGE = '/spots/SPOT_IMAGE';

// action for getting all spots
export const getSpots = (spots) => {
    return {
        type: ALL_SPOTS,
        spots
    }
};

// action for finding specific spot base on params
export const findSpot = (spot) => {
    return {
        type: SINGLE_SPOT,
        spot
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
};

// action for creating a spot image
export const spotImage = () => {
    return {
        type: SPOT_IMAGE
    }
};

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
    dispatch(getSpots(emptyObj));
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

    dispatch(deleteSpot(spotId));
    return spot;
};

// spot images thunk
export const addSpotImage = (images, spotId, url) => async (dispatch) => {
    images.map((image) => {
        const newObj = {};
        if (images.indexOf(image) === 0) {
            newObj.preview = true;
        } else {
            newObj.preview = false;
        }
        newObj.spotId = spotId;
        newObj.url = url;

        return csrfFetch(`/api/spots/${spotId}/images`, {
            method: 'POST',
            body: JSON.stringify(newObj)
        });
    });
};

const initialState = {};
// reducer
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALL_SPOTS:
            return { ...state, allSpots: { ...action.spots } }
        case SINGLE_SPOT:
            return { ...state, singleSpot: { ...action.spot } }
        case DELETE_SPOT:
            const newRef = { ...state.allSpots }
            delete newRef[action.spotId];
            const newState = { ...state, allSpots: { ...newRef } };
            return newState;
        case CREATE_SPOT:
            return { ...state, newSpot: { ...action.spot } }
        default:
            return state;
    }
};

export default spotsReducer;
