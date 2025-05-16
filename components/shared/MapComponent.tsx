'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const containerStyle = {
    width: "100%",
    height: "350px",
    borderRadius: "20px",
    marginTop: "16px",
};

const createIcon = L.icon({
    iconUrl: "/oneLocation.png",
    shadowUrl: markerShadow.src,
    className: 'text-primary',
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapComponentProps {
    mapCenter: [number, number];
    onMapCenterChange: (center: [number, number]) => void;
}

export default function MapComponent({ mapCenter, onMapCenterChange }: MapComponentProps) {
    const MapEvents = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                onMapCenterChange([lat, lng]);
            },
        });
        return null;
    };

    return (
        <MapContainer
            center={mapCenter}
            zoom={15}
            scrollWheelZoom={true}
            style={containerStyle}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mapCenter} icon={createIcon} />
            <MapEvents />
        </MapContainer>
    );
} 