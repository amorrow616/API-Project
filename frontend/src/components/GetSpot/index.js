import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as spotActions from '../../store/spots';
import './GetSpot.css';

export default function GetSpot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot);

    useEffect(() => {
        dispatch(spotActions.fetchOneSpot(spotId));
    }, [dispatch, spotId]);

    if (spot === undefined) return null;

    const reserveButton = () => {
        alert('Feature coming soon');
    }
    return (
        <>
            <div className='spotPage'>
                <h1 id='spotName'>{spot.name && spot.name}</h1>
                <div>{spot.city && spot.city}, {spot.state && spot.state}, {spot.country && spot.country}</div>
                <div className='detailImages'>
                    <img src={spot.SpotImages.length && spot.SpotImages[0].url} alt='preview of the spot' id='prevImg'></img>
                    <img src='https://media.istockphoto.com/id/1263083361/photo/modern-home-with-intricate-detail-throughout.jpg?s=612x612&w=0&k=20&c=Ax4uHREjcKprK5sHPPURkhR-fz4Wct5m-zUoCnOYhiY=' id='detailImage2' alt='a view of the living room'></img>
                    <img src='https://media.istockphoto.com/id/1297586166/photo/modern-elegant-kitchen-stock-photo.jpg?s=612x612&w=0&k=20&c=4qVGJq3EZ-DrVC08kFIXuZMGRe5NcEvziV-H4L9aFKc=' id='detailImage3' alt='a view of the kitchen'></img>
                    <img src='https://media.istockphoto.com/id/1264323513/photo/scandinavian-bedroom-interior-stock-photo.jpg?s=612x612&w=0&k=20&c=jYMbmLtLDOezPThalkXCfrKjbgkYHpQX2oY3-vjPhVI=' id='detailImage4' alt='a view of one of the bedrooms'></img>
                    <img src='https://media.istockphoto.com/id/1291917591/photo/modern-bathroom-interior-stock-photo.jpg?s=612x612&w=0&k=20&c=pxqczxYLHDIm0zskG3QgktaO0ICwAd3H4x5b8vdIRuY=' id='detailImage5' alt='a view of one of the bathrooms'></img>
                </div>
                <div className='bottomDetail'>
                    <h2 id='detailName'>Hosted by {spot.Owner.firstName && spot.Owner.firstName} {spot.Owner.lastName && spot.Owner.lastName}</h2>
                    <div id='detailDescription'>{spot.description && spot.description}</div>
                    <div className='reserveBox'>
                        <div id='detailPrice'>${spot.price && spot.price} night</div>
                        <div id='detailRating'><i class='fa-solid fa-star' />{spot.avgStarRating && spot.avgStarRating}</div>
                        <div id='detailReviews'>{spot.numReviews && spot.numReviews} reviews</div>
                        <button onClick={reserveButton} id='detailsButton'>Reserve</button>
                    </div>
                </div>
                <hr />
                <h3><i class='fa-solid fa-star' />{spot.avgStarRating && spot.avgStarRating} ~ {spot.numReviews && spot.numReviews} reviews</h3>
            </div>
        </>
    )
};
