// to help with typos
const GET_SPOTS = '/spots/GET_SPOTS';
const FIND_SPOT = '/spots/FIND_SPOT';

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

// get all spots thunk
export const fetchSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    const spots = await response.json();

    // if (spots && spots.errors) return console.log(spots.errors);

    const emptyObj = {};
    spots.Spots.map((spot) => {
        return emptyObj[spot.id] = spot
    }) // this is to flatten the data

    dispatch(getSpots(emptyObj));
};

// get one spot thunk
export const fetchOneSpot = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`);
    const spot = await response.json();

    dispatch(findSpot(spot));
};

const initialState = {};
// reducer
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS:
            return { ...state, spots: { ...action.spots } }
        case FIND_SPOT:
            return { ...state, spot: { ...action.spot } }
        default:
            return state;
    }
};

export default spotsReducer;
