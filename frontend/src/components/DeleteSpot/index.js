import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as spotActions from '../../store/spots';
import './DeleteSpot.css';

export default function DeleteSpot(props) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const spotId = props.props;

    const spotDelete = (e, spotId) => {
        e.preventDefault();
        dispatch(spotActions.deleteSpotThunk(spotId));
        closeModal();
    };

    return (
        <>
            <h1 id='deleteSpotHead'>Confirm Delete</h1>
            <h2 id='deleteSpotBlurb'>Are you sure you want to remove this spot from the listings?</h2>
            <button onClick={(e) => spotDelete(e, spotId)} id='deleteButton'>Yes (Delete Spot)</button>
            <button onClick={closeModal} id='dontDeleteButton'>No (Keep Spot)</button>
        </>
    )
}
