import { csrfFetch } from "./csrf";

const BOOKING_SLICE = '/bookings/BOOKING_SLICE';
const USER_BOOKINGS = '/bookings/USER_BOOKINGS';
const SPOT_BOOKINGS = '/bookings/SPOT_BOOKINGS';
const DELETE_BOOKING = '/bookings/DELETE_BOOKING';

export const userBookings = (bookings) => {
    return {
        type: USER_BOOKINGS,
        bookings
    }
};

export const deleteBooking = (bookingId) => {
    return {
        type: DELETE_BOOKING,
        bookingId
    }
};

export const findUserBookings = (userId) => async (dispatch) => {
    const response = await csrfFetch('/api/bookings/current');
    const bookings = await response.json();

    const flatten = {};
    bookings.Bookings.map((booking) => {
        return flatten[booking.id] = booking;
    });

    dispatch(userBookings(flatten));
};

const initialState = { booking: {}, user: {} };

const bookingsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        default:
            return state;
    }
};

export default bookingsReducer;
