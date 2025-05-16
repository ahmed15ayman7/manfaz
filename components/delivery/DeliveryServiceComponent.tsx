"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import * as L from "leaflet";
import "leaflet-routing-machine";
import { motion } from "framer-motion";
import { Paper, Button } from "@mui/material";
import { IconCurrentLocation } from "@tabler/icons-react";
import useStore from "@/store/useLanguageStore";
import { useTranslations } from "next-intl";
import SetMapRef from "@/components/map/SetMapRef";

// Fixing Leaflet's missing marker icons
const defaultCenter = {
    lat: 24.7136,
    lng: 46.6753,
};

import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const createIcon = L.icon({
    iconUrl: "/oneLocation.png",
    shadowUrl: markerShadow.src,
    className: 'text-primary',
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const createIcon2 = L.icon({
    iconUrl: "/twoLocation.png",
    shadowUrl: markerShadow.src,
    className: 'text-primary',
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export default function DeliveryServiceComponent() {
    const t = useTranslations("home");
    const { locale } = useStore();
    const [startLocation, setStartLocation] = useState<L.LatLngLiteral | null>(null);
    const [endLocation, setEndLocation] = useState<L.LatLngLiteral | null>(null);
    const [currentLocation, setCurrentLocation] = useState<L.LatLngLiteral | null>(null);
    const [isSelectingStart, setIsSelectingStart] = useState(true);
    const mapRef = useRef<L.Map>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const routingControlRef = useRef<any>(null);

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (isSelectingStart) {
            setStartLocation({ lat, lng });
            setIsSelectingStart(false);
        } else {
            setEndLocation({ lat, lng });
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCurrentLocation(location);
                    mapRef.current?.flyTo(location, 13);
                },
                (error) => {
                    console.error("Error getting current location:", error);
                }
            );
        }
    };

    const resetLocations = () => {
        setStartLocation(null);
        setEndLocation(null);
        setIsSelectingStart(true);

        if (routingControlRef.current) {
            routingControlRef.current.remove();
            routingControlRef.current = null;
        }
    };

    useEffect(() => {
        if (startLocation && endLocation && mapRef.current) {
            if (routingControlRef.current) {
                routingControlRef.current.setWaypoints([
                    L.latLng(startLocation.lat, startLocation.lng),
                    L.latLng(endLocation.lat, endLocation.lng),
                ]);
                routingControlRef.current.on('routesfound', function (e: any) {
                    const route = e.routes[0];
                    const distanceInMeters = route.summary.totalDistance;
                    const distanceInKilometers = distanceInMeters / 1000;
                    setDistance(Number(distanceInKilometers.toFixed(2)));
                });
            } else {
                routingControlRef.current = (L as any).Routing.control({
                    waypoints: [
                        L.latLng(startLocation.lat, startLocation.lng),
                        L.latLng(endLocation.lat, endLocation.lng),
                    ],
                    routeWhileDragging: true,
                    show: false,
                    addWaypoints: false,
                    lineOptions: { addWaypoints: false },
                }).addTo(mapRef.current);

                routingControlRef.current?.on('routesfound', function (e: any) {
                    const route = e.routes[0];
                    const distanceInMeters = route.summary.totalDistance;
                    const distanceInKilometers = distanceInMeters / 1000;
                    setDistance(Number(distanceInKilometers.toFixed(2)));
                });
            }
        }
    }, [startLocation, endLocation]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const MapClickHandler = () => {
        useMapEvents({
            click: handleMapClick,
        });
        return null;
    };

    return (
        <div className="relative">
            {distance && (
                <div className="absolute bottom-[100px] left-4 right-4 z-[900000] text-white text-center font-bold text-lg">
                    {t("map.distance")}: {distance} كم
                </div>
            )}
            <MapContainer
                center={currentLocation || defaultCenter}
                zoom={13}
                style={{ height: "80vh", width: "100%", zIndex: "20" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler />
                <SetMapRef mapRef={mapRef} />
                {startLocation && (
                    <Marker pane="markerPane" position={startLocation} icon={createIcon} />
                )}
                {endLocation && (
                    <Marker pane="markerPane" position={endLocation} icon={createIcon2} />
                )}
            </MapContainer>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-10 left-4 right-4 z-[900000] w-20"
            >
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Button
                            variant="contained"
                            onClick={getCurrentLocation}
                            className="flex-1 bg-white"
                        >
                            <IconCurrentLocation />
                        </Button>
                    </div>
                </div>
            </motion.div>

            {startLocation && endLocation && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-4 left-4 right-4  z-[900000]"
                >
                    <Paper className="p-4 shadow-lg rounded-lg">
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                                // Handle Confirm
                            }}
                        >
                            {t("map.confirm_locations")}
                        </Button>
                    </Paper>
                </motion.div>
            )}
        </div>
    );
} 