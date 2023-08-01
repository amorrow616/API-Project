// to help with typos
const GET_SPOTS = '/spots/GET_SPOTS';

// action
export const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
};

// get all spots thunk
export const fetchSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    const spots = await response.json();

    // if (spots && spots.errors) return console.log(spots.errors);

    const emptyObj = {};
    spots.Spots.map((spot) => {
        emptyObj[spot.id] = spot
    })

    dispatch(getSpots(emptyObj));
};

const initialState = {};
// reducer
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS:
            return { ...state, spots: { ...action.spots } }
        default:
            return state;
    }
};

export default spotsReducer;
