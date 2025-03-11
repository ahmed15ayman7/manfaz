"use client"
import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Paper, Button, IconButton } from '@mui/material';
import { IconCurrentLocation, IconMapPin, IconX } from '@tabler/icons-react';
import useStore from '@/store/useLanguageStore';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 24.7136,
  lng: 46.6753
};

const libraries: ("places")[] = ["places"];

export default function DeliveryService() {
  const t = useTranslations('home');
  const { locale } = useStore();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [startLocation, setStartLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [endLocation, setEndLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isSelectingStart, setIsSelectingStart] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const location = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };

    if (isSelectingStart) {
      setStartLocation(location);
      setIsSelectingStart(false);
    } else {
      setEndLocation(location);
    }
  }, [isSelectingStart]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          map?.panTo(location);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  };

  useEffect(() => {
    if (startLocation && endLocation) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: startLocation,
          destination: endLocation,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [startLocation, endLocation]);

  const resetLocations = () => {
    setStartLocation(null);
    setEndLocation(null);
    setDirections(null);
    setIsSelectingStart(true);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-xl">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {startLocation && <Marker position={startLocation} label="A" />}
        {endLocation && <Marker position={endLocation} label="B" />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-4 right-4"
      >
        <Paper className="p-4 shadow-lg rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">{t('delivery')}</h1>
            <IconButton onClick={resetLocations} size="small">
              <IconX size={20} />
            </IconButton>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <IconMapPin className="text-primary" size={24} />
              <div className="flex-1">
                <p className="text-sm text-gray-500">
                  {isSelectingStart ? t('map.select_start') : t('map.select_end')}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="contained"
                onClick={getCurrentLocation}
                startIcon={<IconCurrentLocation />}
                className="flex-1"
              >
                {t('get_user_location_view.choose')}
              </Button>
            </div>
          </div>
        </Paper>
      </motion.div>

      {startLocation && endLocation && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <Paper className="p-4 shadow-lg rounded-lg">
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                // Handle delivery request
              }}
            >
              {t('map.confirm_locations')}
            </Button>
          </Paper>
        </motion.div>
      )}
    </div>
  );
} 