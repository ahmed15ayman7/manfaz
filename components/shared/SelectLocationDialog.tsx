"use client";

import {
    Box,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Paper,
    Stack,
    Typography,
    CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import HotelIcon from "@mui/icons-material/Hotel";
import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";
import ParkIcon from "@mui/icons-material/Park";
import NightlifeIcon from "@mui/icons-material/Nightlife"; // club
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UserLocation } from "@/interfaces";
import { useLocale } from "next-intl";
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/lib/apis";
import LocationConfirmDialog from "./LocationConfirmDialog";
import { useLocationStore } from "@/store/useLocationStore";
const fetchLocations = async (userId: string, locale: string) => {
    // رابط وهمي - استبدله بـ API الحقيقي
    const res = await axiosInstance.get(API_ENDPOINTS.userLocations.getAll(userId, { lang: locale }));

    return res?.data?.data || [];
};

const iconMap: Record<string, JSX.Element> = {
    home: <HomeIcon sx={{ color: "#0068FF" }} />,
    work: <WorkIcon sx={{ color: "#0068FF" }} />,
    hotel: <HotelIcon sx={{ color: "#0068FF" }} />,
    school: <SchoolIcon sx={{ color: "#0068FF" }} />,
    park: <ParkIcon sx={{ color: "#0068FF" }} />,
    club: <NightlifeIcon sx={{ color: "#0068FF" }} />,
    other: <LocationOnIcon sx={{ color: "#0068FF" }} />,
};
const SelectLocationDialog = ({ onSelectLocation, setIsDialogOpen, userId }: { onSelectLocation: React.Dispatch<React.SetStateAction<UserLocation>>, setIsDialogOpen: (isDialogOpen: boolean) => void, userId: string }) => {
    const t = useTranslations("locations");
    let locale = useLocale()
    let { setUserLocation } = useLocationStore()
    const [open, setOpen] = useState(false);
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["locations"],
        queryFn: () => fetchLocations(userId, locale),
    });
    useEffect(() => {
        refetch();
    }, [locale, open]);

    return (
        <Box sx={{ width: "100%", bgcolor: "#ffffff" }}>
            <Box
                sx={{
                    bgcolor: "#ffffff",
                    p: 0,
                    overflow: "hidden",
                    position: "fixed",
                    bottom: 0,
                    width: "100%",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                }}
            >
                <Box sx={{ position: "relative", p: 2 }}>
                    <IconButton aria-label="close" sx={{ position: "absolute", top: 8, left: 8 }} onClick={() => setIsDialogOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" align="right" sx={{ mb: 2, fontWeight: "bold" }}>
                        {t("title")}
                    </Typography>

                    {/* الحالة: جاري التحميل */}
                    {isLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : isError || !data?.length ? (
                        <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
                            {t("no_locations")}
                        </Typography>
                    ) : (
                        <Stack spacing={2} sx={{ mt: 4 }}>
                            {data.map((option: any, index: number) => (
                                <Paper
                                    key={index}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        bgcolor: "#f5f5f5",
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        setUserLocation({ latitude: option.latitude, longitude: option.longitude })
                                        onSelectLocation(option);
                                        setIsDialogOpen(false);
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            bgcolor: "#0068FF30",
                                            borderRadius: "50%",
                                            width: 40,
                                            height: 40,
                                            cursor: "pointer",
                                        }}

                                    >
                                        {iconMap[option.type] || <MyLocationIcon sx={{ color: "white" }} />}
                                    </Box>
                                    <Box sx={{ textAlign: "right" }}>
                                        <Typography
                                            variant="body1"
                                            sx={{ fontWeight: "bold", color: "#0068FF",textAlign:"end" }}
                                        >
                                            {option.name}
                                        </Typography>
                                        <Typography variant="body2">{option.address}</Typography>
                                    </Box>
                                </Paper>
                            ))}
                        </Stack>
                    )}

                    {/* زر إضافة عنوان جديد */}
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<MyLocationIcon />}
                        sx={{
                            mt: 3,
                            mb: 1,
                            py: 1.5,
                            bgcolor: "#0068FF",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1,
                            color: "white",
                            borderRadius: 10,
                            "&:hover": {
                                bgcolor: "#0068FF90",
                            },
                        }}
                        onClick={() => setOpen(true)}
                    >
                        {t("new_address")}
                    </Button>
                </Box>
            </Box>
            <LocationConfirmDialog open={open} onClose={() => setOpen(false)} onSelectLocation={onSelectLocation} />
        </Box>
    );
};

export default SelectLocationDialog;
