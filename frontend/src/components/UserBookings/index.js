import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as bookingActions from '../../store/bookings';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteBooking from "../DeleteBooking";
import './UserBookings.css';

export default function UserBookings() {
    const dispatch = useDispatch();
    const bookings = useSelector((state) => state.bookings.user);
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        dispatch(bookingActions.findUserBookings());
    }, [dispatch]);

    if (!Object.values(bookings)) return null;
    return (
        <>
            <h1 id='bookingsTitle'>Your Bookings</h1>
            <ul className='userBookingsList'>
                {Object.values(bookings).map((booking) => (
                    <li key={booking.id}>
                        <img className='bookingImage' src={booking.Spot.previewImage && booking.Spot.previewImage} alt='a preview of the spot you have booked' />
                        <div className='bookingInfo'>
                            <div>From {booking.startDate.slice(0, 10)} to {booking.endDate.slice(0, 10)}</div>
                            <div>{booking.Spot.address}</div>
                            <div>{booking.Spot.city}, {booking.Spot.state}</div>
                            <button onClick={openMenu} className='deleteBookingButton'> <OpenModalMenuItem
                                itemText='Delete'
                                modalComponent={<DeleteBooking props={booking.id} />}
                            /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
