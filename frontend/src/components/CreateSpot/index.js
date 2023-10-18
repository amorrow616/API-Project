import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import './CreateSpot.css';

export default function CreateSpot({ spot, formType }) {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const history = useHistory();
    const [address, setAddress] = useState(formType === 'Update Spot' ? spot.address : '');
    const [city, setCity] = useState(formType === 'Update Spot' ? spot.city : '');
    const [state, setState] = useState(formType === 'Update Spot' ? spot.state : '');
    const [country, setCountry] = useState(formType === 'Update Spot' ? spot.country : '');
    const [lat, setLat] = useState(formType === 'Update Spot' ? spot.lat : '');
    const [lng, setLng] = useState(formType === 'Update Spot' ? spot.lng : '');
    const [name, setName] = useState(formType === 'Update Spot' ? spot.name : '');
    const [description, setDescription] = useState(formType === 'Update Spot' ? spot.description : '');
    const [price, setPrice] = useState(formType === 'Update Spot' ? spot.price : '');
    const [previewImg, setPreviewImg] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [image5, setImage5] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const errors = {};

        if (previewImg.length < 1) {
            errors.previewImg = 'Preview image is required.'
        };
        setErrors(errors)
    }, [previewImg]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newSpot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            images: [
                {
                    url: previewImg,
                    preview: true
                },
                {
                    url: image2,
                    preview: false
                },
                {
                    url: image3,
                    preview: false
                },
                {
                    url: image4,
                    preview: false
                },
                {
                    url: image5,
                    preview: false
                }
            ]
        };

        if (formType === 'Update Spot') {
            const returnFromThunk = spotActions.updateSpotThunk(spotId, newSpot);
            const dbSpot = await dispatch(returnFromThunk).catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
            if (dbSpot) {
                history.push(`/spots/${dbSpot.id}`);
            };
        } else {
            const returnfromThunk = spotActions.createSpotThunk(newSpot); // this returns a function

            const dbSpot = await dispatch(returnfromThunk).catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
            // awaiting the return from the function gives us the new spot

            if (dbSpot) {
                history.push(`/spots/${dbSpot.id}`);
            };
        }
    };
    return (
        <>
            <div id='createFormPage'>
                {formType === 'Update Spot' ? <h1>Update your Spot</h1> : <h1>Create a New Spot</h1>}
                <h2>Where's your place located?</h2>
                <div>Guests will only get your exact address once they booked a reservation.</div>
                <form onSubmit={handleSubmit} id='createFormForm'>
                    <label className='createLabel'>
                        Country {errors.country && <p>{errors.country}</p>}
                        <input
                            className='createInput'
                            type='text'
                            onChange={(e) => setCountry(e.target.value)}
                            value={country}
                            placeholder='Country'
                        />
                    </label>
                    <label className='createLabel'>
                        Street Address {errors.address && <p>{errors.address}</p>}
                        <input
                            className='createInput'
                            type='text'
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                            placeholder='Address'
                        />
                    </label>
                    <div className='cityandstate'>
                        <label className='createLabel'>
                            City {errors.city && <p>{errors.city}</p>}
                            <input
                                className='createCity'
                                type='text'
                                onChange={(e) => setCity(e.target.value)}
                                value={city}
                                placeholder='City'
                            />
                        </label>
                        <label className='createLabel'>
                            State {errors.state && <p>{errors.state}</p>}
                            <input
                                className='createState'
                                type='text'
                                onChange={(e) => setState(e.target.value)}
                                value={state}
                                placeholder='STATE'
                            />
                        </label>
                    </div>
                    <div className='coordinates'>
                        <label className='createLabel'>
                            Latitude {errors.lat && <p>{errors.lat}</p>}
                            <input
                                className='createInput2'
                                type='text'
                                onChange={(e) => setLat(e.target.value)}
                                value={lat}
                                placeholder='Latitude'
                            />
                        </label>
                        <label className='createLabel'>
                            Longitude {errors.lng && <p>{errors.lng}</p>}
                            <input
                                className='createInput2'
                                type='text'
                                onChange={(e) => setLng(e.target.value)}
                                value={lng}
                                placeholder='Longitude'
                            />
                        </label>
                    </div>
                    <h2>Describe your place to guests</h2>
                    <label className='createLabel'>
                        Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.
                        {errors.description && <p>{errors.description}</p>}
                        <textarea
                            id='createTextarea'
                            type='text'
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            placeholder='Please write at least 30 characters'
                        />
                    </label>
                    <h2>Create a title for your spot</h2>
                    <label className='createLabel'>
                        Catch guests' attention with a spot title that highlights what makes your place special.
                        <input
                            className='createInput'
                            type='text'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder='Name of your spot'
                        />
                    </label>
                    {errors.name && <p>{errors.name}</p>}
                    <h2>Set a base price for your spot</h2>
                    <label className='createLabel'>
                        Competitive pricing can help your listing stand out and rank higher in search results.
                        $<input
                            className='createInput'
                            type='number'
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            placeholder='Price per night (USD)'
                        />
                    </label>
                    {errors.price && <p>{errors.price}</p>}
                    <h2>Liven up your spot with photos</h2>
                    <label className='createLabel'>
                        Submit a link to at least one photo to publish your spot.
                        <input
                            className='createInput'
                            type='text'
                            onChange={(e) => setPreviewImg(e.target.value)}
                            value={previewImg}
                            placeholder='Preview Image URL'
                        />
                        {errors.previewImg && <p>{errors.previewImg}</p>}
                        <input
                            className='createInput'
                            type='text'
                            onChange={(e) => setImage2(e.target.value)}
                            value={image2}
                            placeholder='Image URL'
                        />
                        <input
                            className='createInput'
                            type='text'
                            onChange={(e) => setImage3(e.target.value)}
                            value={image3}
                            placeholder='Image URL'
                        />
                        <input
                            className='createInput'
                            type='text'
                            onChange={(e) => setImage4(e.target.value)}
                            value={image4}
                            placeholder='Image URL'
                        />
                        <input
                            className='createInput'
                            type='text'
                            onChange={(e) => setImage5(e.target.value)}
                            value={image5}
                            placeholder='Image URL'
                        />
                    </label>
                    {formType === 'Update Spot' ? <button type='submit' id='createSubmit'>Update your Spot</button> : <button type='submit' id='createSubmit'>Create Spot</button>}
                </form>
            </div>
        </>
    )
}
