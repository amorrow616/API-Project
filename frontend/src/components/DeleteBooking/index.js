import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import * as bookingActions from '../../store/bookings';

export default function DeleteBooking(props) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const bookingId = props.props;

    const bookingDelete = async (e, bookingId) => {
        e.preventDefault();
        await dispatch(bookingActions.deleteBookingThunk(bookingId));
        await dispatch(bookingActions.findUserBookings());
        closeModal();
    };
    return (
        <>
            <div className='deleteReview'>
                <h1 id='deleteSpotHead'>Confirm Delete</h1>
                <h2 id='deleteSpotBlurb'>Are you sure you want to delete this review?</h2>
                <button onClick={(e) => bookingDelete(e, bookingId)} id='deleteButton'>Yes (Delete Booking)</button>
                <button onClick={closeModal} id='dontDeleteButton'>No (Keep Booking)</button>
            </div>
        </>
    )
};
