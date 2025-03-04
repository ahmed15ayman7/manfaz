"use client"
import { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Box, Paper, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

interface LocationMapProps {
    onLocationSelect: (location: { lat: number; lng: number }) => void;
    initialLocation?: { lat: number; lng: number };
}

const LocationMap = ({ onLocationSelect, initialLocation }: LocationMapProps) => {
    const t = useTranslations();
    const mapRef = useRef<google.maps.Map | null>(null);
    const [currentLocation, setCurrentLocation] = useState(initialLocation || {
        lat: 24.7136, // موقع افتراضي (الرياض)
        lng: 46.6753
    });

    useEffect(() => {
        if (!initialLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
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

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const newLocation = {
            lat: event.latLng?.lat() || 0,
            lng: event.latLng?.lng() || 0
        };
        setCurrentLocation(newLocation);
        onLocationSelect(newLocation);
    };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <Box sx={{ height: '400px', width: '100%', position: 'relative' }}>
                <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={currentLocation}
                    zoom={15}
                    onClick={handleMapClick}
                    onLoad={map => {
                        mapRef.current = map;
                    }}
                >
                    <Marker position={currentLocation} />
                </GoogleMap>
                <Paper
                    elevation={3}
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16,
                        p: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                >
                    <Typography variant="body2">
                        {t('location.click_to_select')}
                    </Typography>
                </Paper>
            </Box>
        </LoadScript>
    );
};

export default LocationMap; 