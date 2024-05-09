import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Location() {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [nearestLocations, setNearestLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const options = {
                method: 'GET',
                url: 'https://maps-data.p.rapidapi.com/nearby.php',
                params: {
                    query: 'gym',
                    lat: latitude,
                    lng: longitude,
                    limit: '5',
                    lang: 'en',
                    offset: '0',
                    zoom: '12'
                },
                headers: {
                    'X-RapidAPI-Key': '66d7629d69mshc0a9f88ee2b028cp1c2fdajsn2d27fefab8ff',
                    'X-RapidAPI-Host': 'maps-data.p.rapidapi.com'
                }
            };

            try {
                const response = await axios.request(options);
                setNearestLocations(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false); 
            }
        };

        if (latitude !== '' && longitude !== '') {
            fetchData();
        }
    }, [latitude, longitude]); 

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading.......</div>;
    }
    return (
        <div className="mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {nearestLocations.map((location, index) => (
            <div key={index} className="w-full bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
              {location.photos && location.photos.length > 0 && (
                <img src={location.photos[0].src} alt="Location" className="mb-2 rounded-lg" />
              )}
              <a href={location.place_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View on Google Maps</a>
            </div>
          ))}
        </div>
      </div>
    );
}
