import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from "../../context/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as bookingActions from '../../store/bookings';
import './UpdateBooking.css';

export default function UpdateBooking(props) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const booking = props.props;
    const [startDate, setStartDate] = useState(new Date(booking.startDate));
    const [endDate, setEndDate] = useState(new Date(booking.endDate));
    const [errors, setErrors] = useState({});

    const reserveButton = async (e) => {
        e.preventDefault();
        const newBooking = {
            startDate,
            endDate
        }

        await dispatch(bookingActions.updateBookingThunk(booking.id, newBooking)).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors);
            }
        });
        closeModal();
    };

    const setToMidnight = (date) => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
        return newDate;
    };

    return (
        <form className='updateBookingForm'>
            <div id='updateContainer'>
                Check-In
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(setToMidnight(date))}
                    shouldCloseOnSelect={true}
                />
                Checkout
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(setToMidnight(date))}
                    shouldCloseOnSelect={true}
                />
            </div>
            {errors.startDate && <p>{errors.message}</p>}
            {errors.endDate && <p>{errors.message}</p>}
            <button onClick={reserveButton} id='updateBookingButton'>Reserve</button>
        </form>
    )
};
