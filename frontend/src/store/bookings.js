import { csrfFetch } from "./csrf";

const USER_BOOKINGS = '/bookings/USER_BOOKINGS';
const SPOT_BOOKINGS = '/bookings/SPOT_BOOKINGS';
const DELETE_BOOKING = '/bookings/DELETE_BOOKING';

export const userBookings = (userBookings) => {
    return {
        type: USER_BOOKINGS,
        userBookings
    }
};

export const spotBookings = (spotBookings) => {
    return {
        type: SPOT_BOOKINGS,
        spotBookings
    }
};

export const deleteBooking = (bookingId) => {
    return {
        type: DELETE_BOOKING,
        bookingId
    }
};

export const findUserBookings = () => async (dispatch) => {
    const response = await csrfFetch('/api/bookings/current');
    const bookings = await response.json();

    const flatten = {};
    bookings.Bookings.map((booking) => {
        return flatten[booking.id] = booking;
    });

    dispatch(userBookings(flatten));
};

export const findSpotBookings = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
    const bookings = await response.json();

    const flatten = {};
    bookings.Bookings.map((booking) => {
        return flatten[booking.id] = booking;
    });

    dispatch(spotBookings(flatten));
};

export const createBookingThunk = (payload, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        const booking = await response.json();
        dispatch(findUserBookings());
        return booking;
    }
};

export const updateBookingThunk = (bookingId, payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const booking = await response.json();
    if (booking && !booking.errors) dispatch(findUserBookings());
    return booking;
};

export const deleteBookingThunk = (bookingId) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
    });
    const booking = await response.json();

    dispatch(deleteBooking(bookingId));
    return booking;
}

const initialState = { user: {}, spot: {} };

const bookingsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case USER_BOOKINGS:
            newState = Object.assign({}, state);
            newState.user = action.userBookings;
            return newState;
        case SPOT_BOOKINGS:
            newState = Object.assign({}, state);
            newState.spot = action.spotBookings;
            return newState;
        case DELETE_BOOKING:
            const newRef = { ...state.spot };
            delete newRef[action.bookingId];
            const newInfo = { ...state, spot: { ...newRef } };
            return newInfo;
        default:
            return state;
    }
};

export default bookingsReducer;
