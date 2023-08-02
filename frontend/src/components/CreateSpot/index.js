import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as spotActions from '../../store/spots';

export default function CreateSpot() {
    const dispatch = useDispatch();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);

    const handleSubmit = (e) => {
        e.preventdefault();
        const newSpot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        };

        dispatch(spotActions.createSpotThunk(newSpot));
        setAddress('');
        setCity('');
        setState('');
        setCountry('');
        setLat('');
        setLng('');
        setName('');
        setDescription('');
        setPrice('')
    }
    return (
        <>
            <h1>Create a new Spot</h1>
            <h2>Where's your place located?</h2>
            <div>Guests will only get your exact address once they booked a reservation.</div>
            <form onSubmit={handleSubmit}>
                <label>
                    Country
                    <input
                        type='text'
                        onChange={(e) => setCountry(e.target.value)}
                        value={country}
                        placeholder='Country'
                        required
                    />
                </label>
                <label>
                    Street Address
                    <input
                        type='text'
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                        placeholder='Address'
                        required
                    />
                </label>
                <label>
                    City
                    <input
                        type='text'
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                        placeholder='City'
                        required
                    />
                </label>
                ,
                <label>
                    State
                    <input
                        type='text'
                        onChange={(e) => setState(e.target.value)}
                        value={state}
                        placeholder='STATE'
                        required
                    />
                </label>
                <label>
                    Latitude
                    <input
                        type='text'
                        onChange={(e) => setLat(e.target.value)}
                        value={lat}
                        placeholder='Latitude'
                        required
                    />
                </label>
                ,
                <label>
                    Longitude
                    <input
                        type='text'
                        onChange={(e) => setLng(e.target.value)}
                        value={lng}
                        placeholder='Longitude'
                        required
                    />
                </label>
                <h2>Describe your place to guests</h2>
                <label>
                    Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.
                    <textarea
                        type='text'
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        placeholder='Please write at least 30 characters'
                        required
                    />
                </label>
                <h2>Create a title for your spot</h2>
                <label>
                    Catch guests' attention with a spot title that highlights what makes your place special.
                    <input
                        type='text'
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder='Name of your spot'
                        required
                    />
                </label>
                <h2>Set a base price for your spot</h2>
                <label>
                    Competitive pricing can help your listing stand out and rank higher in search results.
                    $ <input
                        type='number'
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        placeholder='Price per night (USD)'
                        required
                    />
                </label>
                <h2>Liven up your spot with photos</h2>
                <label>
                    Submit a link to at least one photo to publish your spot.
                    {/* <input
                        type='url'
                        onChange={(e) => (e.target.value)}
                        value={ }
                        placeholder='Preview Image URL'
                        required
                    /> */}
                </label>
            </form>
        </>
    )
}
