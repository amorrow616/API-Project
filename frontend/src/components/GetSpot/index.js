import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { findSpot } from '../../store/spots';

export default function GetSpot() {
    const { spotId } = useParams();
    // const spot = useSelector(findSpot(spotId));
    // console.log(spot)
    return (
        <h1>spot stuff</h1>
    )
};
