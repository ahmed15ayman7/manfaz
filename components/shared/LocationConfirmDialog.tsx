'use client';
import React, { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, IconButton, Box, Typography, Button, TextField, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';
import { UserLocation } from "@/interfaces";
import { useLocationStore } from "@/store/useLocationStore";
import SaveLocationDetails from './SaveLocationDetails';
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/lib/apis";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const MapComponent = dynamic(
    () => import('./MapComponent'),
    { ssr: false }
);

export default function LocationConfirmDialog({ open, onClose, onSelectLocation }: { open: boolean, onClose: () => void, onSelectLocation: React.Dispatch<React.SetStateAction<UserLocation>> }) {
    const t = useTranslations("confirm_location");
    const locale = useLocale();
    const { data: session } = useSession();
    const [mapCenter, setMapCenter] = useState<[number, number]>([30.465, 31.184]);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const [searchInput, setSearchInput] = useState('');
    let { setUserLocation } = useLocationStore()
    const isRTL = locale === 'ar' || locale === 'ur';
    const [showSaveDetails, setShowSaveDetails] = useState(false);

    const fetchAddress = async (lat: number, lng: number) => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=${locale}&key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            setAddress(data.results[0].formatted_address);
            return data.results[0].formatted_address;
        }
        return "";
    };

    const handleSelect = async () => {
        setLoading(true);
        const address = await fetchAddress(mapCenter[0], mapCenter[1]);
        setLoading(false);
        setShowSaveDetails(true);
    };

    const handleSaveLocation = async (data: any) => {
        let { address, details, image, saveForLater, locationType, customName } = data;
        setUserLocation({
            latitude: mapCenter[0],
            longitude: mapCenter[1],
        });
        onSelectLocation((prev: UserLocation) => ({
            ...prev,
            latitude: mapCenter[0],
            longitude: mapCenter[1],
            address: address + " " + details,
            type: locationType,
            name: customName ?? locationType,
        }));
        if (saveForLater && session?.user?.id) {
            let response = await axiosInstance.post(API_ENDPOINTS.userLocations.create(session?.user?.id, {}, false), {
                latitude: mapCenter[0],
                longitude: mapCenter[1],
                address: address + " " + details,
                type: locationType,
                name: customName.trim().length > 0 ? customName : locationType,
            })
            if (response.data.status) {
                toast.success(t('locationSaved'));
            } else {
                toast.error(t('locationNotSaved'));
            }
        }
        setShowSaveDetails(false);
        onClose();
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const lang = navigator.language || "en";
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=${lang}`);
                        const data = await response.json();
                        const city = data.address.city || data.address.town || data.address.village || data.address.state || "📍";
                        setAddress(city);
                        setMapCenter([latitude, longitude]);
                    } catch (err) {
                        console.error("Error fetching location", err);
                        setAddress("📍");
                    }
                });
            }
        }
    }, []);
    useEffect(() => {
        fetchAddress(mapCenter[0], mapCenter[1]);
    }, [mapCenter]);

    const fetchAddressFromSearch = async (query: string) => {
        if (!query) return;
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&language=${locale}&key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.results && data.results.length > 0) {
            const location = data.results[0]?.geometry?.location;
            if (location) {
                setAddress(data.results[0]?.formatted_address);
                setMapCenter([location.lat, location.lng]);
            }
        } else {
            setAddress(t('address'));
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAddressFromSearch(searchInput);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ style: { borderRadius: 20 } }}>
            <DialogContent sx={{ p: 0, position: "relative", overflow: "hidden", direction: isRTL ? 'rtl' : 'ltr' }}>
                {/* Header */}
                <Box sx={{ p: 3, pb: 1, textAlign: "center", position: "relative" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {t('confirmLocation')}
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{ position: "absolute", right: isRTL ? 'unset' : 8, left: isRTL ? 8 : 'unset', top: 8, color: "#888" }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                {showSaveDetails ? (
                    <SaveLocationDetails address={address} onSave={handleSaveLocation} onCancel={() => setShowSaveDetails(false)} />
                ) : (
                    <>
                        {/* Search Bar */}
                        <Box sx={{ px: 2, position: "absolute", top: 70, left: 0, right: 0, zIndex: 2 }}>
                            <Paper
                                elevation={3}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "30px",
                                    px: 2,
                                    py: 0.5,
                                    width: "90%",
                                    mx: "auto",
                                    flexDirection: isRTL ? 'row-reverse' : 'row'
                                }}
                            >
                                <img src="/assets/svg/google.svg" alt="powered by google" style={{ height: 20, marginLeft: isRTL ? 8 : 0, marginRight: isRTL ? 0 : 8 }} />
                                <TextField
                                    placeholder={t('searchMap')}
                                    variant="standard"
                                    InputProps={{ disableUnderline: true, sx: { fontSize: 16, flex: 1, direction: isRTL ? 'rtl' : 'ltr' } }}
                                    sx={{ flex: 1, ml: isRTL ? 0 : 1, mr: isRTL ? 1 : 0 }}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(e); }}
                                />
                            </Paper>
                        </Box>
                        {/* Map */}
                        <Box sx={{ mt: 7, mb: 2, px: 2 }}>
                            <MapComponent
                                mapCenter={mapCenter}
                                onMapCenterChange={setMapCenter}
                            />
                        </Box>
                        {/* Address Box */}
                        <Box
                            sx={{
                                background: "#fff",
                                borderRadius: "20px 20px 0 0",
                                boxShadow: "0 -2px 8px #0001",
                                p: 2,
                                position: "relative",
                                mt: -2,
                            }}
                        >
                            <Paper
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "16px",
                                    gap: "20px",
                                    px: 2,
                                    py: 1,
                                    mb: 2,
                                    background: "#F5F5F5",
                                    fontWeight: "bold",
                                    fontSize: 16,
                                    direction: isRTL ? 'rtl' : 'ltr',
                                }}
                            >
                                <span style={{ color: "#0068FF", fontWeight: "bold", marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>●</span>
                                {address}
                            </Paper>
                            <Button
                                fullWidth
                                variant="contained"
                                className="bg-primary hover:bg-primary/90"
                                sx={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: 20,
                                    borderRadius: "16px",
                                    py: 1.5,
                                }}
                                onClick={handleSelect}
                                disabled={loading}
                            >
                                {loading ? t('loading') || "..." : t('choose')}
                            </Button>
                        </Box>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
