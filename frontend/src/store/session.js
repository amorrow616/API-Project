import { csrfFetch } from "./csrf";

// to help with typos
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

// the action for setting a user
const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    }
};

// the action for removing a user
const removeUser = () => {
    return {
        type: REMOVE_USER
    }
};

// login thunk
export const login = (user) => async (dispatch) => {
    // destructure the credential and password that the user submitted
    const { credential, password } = user;
    // await and stringify the response from the csrf fetch
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        })
    });
    // convert the response to json so it can be used
    const data = await response.json();
    // passing the converted user data to the set user action, dispatching it to create the action
    dispatch(setUser(data.user));
    return response;
};
// the user is null by default
const initialState = { user: null };

// the reducer
export default function sessionReducer(state = initialState, action) {
    let newState; // this will need to be reassigned, don't have a value for it just yet
    switch (action.type) {
        case SET_USER:
            newState = Object.assign({}, state); // merges the empty object and the current state, rewriting any duplicate values with the ones from the state
            newState.user = action.payload; // setting the user to the payload of the setUser action
            return newState;
        case REMOVE_USER:
            newState = Object.assign({}, state); // merges the empty object and the current state, rewriting any duplicate values with the ones from the state
            newState.user = null; // setting the user back to null
            return newState;
        default:
            return state;
    }
};
