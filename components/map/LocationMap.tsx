'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
    iconUrl: '/leaflet/images/marker-icon.png',
    shadowUrl: '/leaflet/images/marker-shadow.png',
});

interface LocationMapProps {
    onLocationSelect: (location: { lat: number; lng: number }) => void;
    initialLocation?: { lat: number; lng: number };
}

const LocationMap = ({ onLocationSelect, initialLocation }: LocationMapProps) => {
    const t = useTranslations();
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number }>(
        initialLocation || { lat: 24.7136, lng: 46.6753 } // Riyadh default
    );

    useEffect(() => {
        if (!initialLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCurrentLocation(newLocation);
                    onLocationSelect(newLocation);
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, [initialLocation, onLocationSelect]);

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                const newLocation = {
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                };
                setCurrentLocation(newLocation);
                onLocationSelect(newLocation);
            },
        });
        return null;
    };

    return (
        <Box sx={{ height: '400px', width: '100%', position: 'relative' }}>
            <MapContainer
                center={currentLocation}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={currentLocation} />
                <MapEvents />
            </MapContainer>

            <Paper
                elevation={3}
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}
            >
                <Typography variant="body2">
                    {t('location.click_to_select')}
                </Typography>
            </Paper>
        </Box>
    );
};

export default LocationMap;

// "use client"
// import { useEffect, useRef, useState } from 'react';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import { Box, Paper, Typography } from '@mui/material';
// import { useTranslations } from 'next-intl';

// interface LocationMapProps {
//     onLocationSelect: (location: { lat: number; lng: number }) => void;
//     initialLocation?: { lat: number; lng: number };
// }

// const LocationMap = ({ onLocationSelect, initialLocation }: LocationMapProps) => {
//     const t = useTranslations();
//     const mapRef = useRef<google.maps.Map | null>(null);
//     const [currentLocation, setCurrentLocation] = useState(initialLocation || {
//         lat: 24.7136, // موقع افتراضي (الرياض)
//         lng: 46.6753
//     });

//     useEffect(() => {
//         if (!initialLocation && navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const newLocation = {
//                         lat: position.coords.latitude,
//                         lng: position.coords.longitude
//                     };
//                     setCurrentLocation(newLocation);
//                     onLocationSelect(newLocation);
//                 },
//                 (error) => {
//                     console.error('Error getting location:', error);
//                 }
//             );
//         }
//     }, [initialLocation, onLocationSelect]);

//     const handleMapClick = (event: google.maps.MapMouseEvent) => {
//         const newLocation = {
//             lat: event.latLng?.lat() || 0,
//             lng: event.latLng?.lng() || 0
//         };
//         setCurrentLocation(newLocation);
//         onLocationSelect(newLocation);
//     };

//     return (
//         <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
//             <Box sx={{ height: '400px', width: '100%', position: 'relative' }}>
//                 <GoogleMap
//                     mapContainerStyle={{ height: '100%', width: '100%' }}
//                     center={currentLocation}
//                     zoom={15}
//                     onClick={handleMapClick}
//                     onLoad={map => {
//                         mapRef.current = map;
//                     }}
//                 >
//                     <Marker position={currentLocation} />
//                 </GoogleMap>
//                 <Paper
//                     elevation={3}
//                     sx={{
//                         position: 'absolute',
//                         bottom: 16,
//                         left: 16,
//                         right: 16,
//                         p: 2,
//                         backgroundColor: 'rgba(255, 255, 255, 0.9)'
//                     }}
//                 >
//                     <Typography variant="body2">
//                         {t('location.click_to_select')}
//                     </Typography>
//                 </Paper>
//             </Box>
//         </LoadScript>
//     );
// };

// export default LocationMap; 