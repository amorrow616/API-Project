import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import CreateSpot from '../CreateSpot';
import * as spotActions from '../../store/spots';

export default function UpdateSpot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot);

    useEffect(() => {
        dispatch(spotActions.updateSpotThunk(spotId));
    }, [dispatch, spotId])
    return (
        <CreateSpot spot={spot} formType='Update Spot' />
    )
}
