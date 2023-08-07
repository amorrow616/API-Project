import { useSelector } from 'react-redux';
import CreateSpot from '../CreateSpot';

export default function UpdateSpot() {
    const spot = useSelector((state) => state.spots.singleSpot);

    return (
        <CreateSpot spot={spot} formType='Update Spot' />
    )
}
