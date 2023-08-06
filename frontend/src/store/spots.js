import { csrfFetch } from "./csrf";

// to help with typos
const ALL_SPOTS = '/spots/ALL_SPOTS';
const SINGLE_SPOT = '/spots/SINGLE_SPOT';
const DELETE_SPOT = '/spots/DELETE_SPOT';

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
        dispatch(findSpot(spot));
        return spot;
    }
};

// delete spot thunk
export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });
    const spot = await response.json();

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

// update spot thunk
export const updateSpotThunk = (spotId, payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(findSpot(spot));
        return spot;
    }
}

const initialState = { allSpots: {}, singleSpot: {} };
// reducer
export default function spotsReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case ALL_SPOTS:
            newState = Object.assign({}, state);
            newState.allSpots = action.spots;
            return newState;
        // return { ...state, allSpots: { ...action.spots } }
        case SINGLE_SPOT:
            newState = Object.assign({}, state);
            newState.singleSpot = action.spot;
            return newState;
        // return { ...state, singleSpot: { ...action.spot } }
        case DELETE_SPOT:
            const newRef = { ...state.allSpots }
            delete newRef[action.spotId];
            const newInfo = { ...state, allSpots: { ...newRef } };
            return newInfo;
        default:
            return state;
    }
};
