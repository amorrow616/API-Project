import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as spotActions from '../../store/spots';

export default function DeleteSpot() {
    const history = useHistory();
    const dispatch = useDispatch();

    const spotDelete = (e, spotId) => {
        e.preventDefault();
        dispatch(spotActions.deleteSpotThunk(spotId));
        history.push('/');
    };
    return (
        <>
            <h1>Confirm Delete</h1>
            <h2>Are you sure you want to remove this spot from the listings?</h2>
            <button onClick={(e) => spotDelete(e)}>Yes (Delete Spot)</button>
            <button>No (Keep Spot)</button>
        </>
    )
}
