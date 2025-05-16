"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    InputBase,
    Paper,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/useUser";

// Icons for address types
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import HotelIcon from "@mui/icons-material/Hotel";
import SchoolIcon from "@mui/icons-material/School";
import OtherHousesIcon from "@mui/icons-material/OtherHouses";
import ParkIcon from "@mui/icons-material/Park";
import NightlifeIcon from "@mui/icons-material/Nightlife"; // club
import SelectLocationDialog from "./SelectLocationDialog";
import { UserLocation, User } from "@/interfaces";
const iconMap: Record<string, JSX.Element> = {
    home: <HomeIcon sx={{ color: "#0068FF" }} />,
    work: <WorkIcon sx={{ color: "#0068FF" }} />,
    hotel: <HotelIcon sx={{ color: "#0068FF" }} />,
    school: <SchoolIcon sx={{ color: "#0068FF" }} />,
    park: <ParkIcon sx={{ color: "#0068FF" }} />,
    club: <NightlifeIcon sx={{ color: "#0068FF" }} />,
    other: <LocationOnIcon sx={{ color: "#0068FF" }} />,
};

const WelcomeUser = ({ onSearch }: { onSearch: (search: string) => void }) => {
    const t = useTranslations();
    const { user } = useUser();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [locationName, setLocationName] = useState("..."); // اسم الموقع
    // const [locationType, setLocationType] = useState<"home" | "work" | "hotel" | "club" | "park" | "school" | "other">("home");
    const [location, setLocation] = useState<UserLocation>({ name: "", id: "", userId: "", address: "", latitude: 0, isDefault: false, city: "", longitude: 0, createdAt: new Date(), updatedAt: new Date(), user: user as User, type: "home" });
    // Get user's location using Geolocation API
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async position => {
                    try {
                        const { latitude, longitude } = position.coords;

                        // ترجمة العنوان حسب اللغة الحالية
                        const lang = navigator.language || "en";

                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=${lang}`);
                        const data = await response.json();

                        const city = data.address.city || data.address.town || data.address.village || data.address.state || "📍";

                        setLocationName(city);
                        setLocation((prev) => ({ ...prev, address: city, city: data.address.city, type: "other" as "home" | "work" | "hotel" | "school" | "club" | "party" }))
                    } catch (err) {
                        console.error("Error fetching location", err);
                        setLocationName("📍");
                    }
                });
            }
        }
    }, []);
    function removePlusCode(text: string): string {
        return text.replace(/\b[A-Z0-9]{4,}\+[A-Z0-9]{2,}\b/g, '').replace(/[.,،;:(){}[\]\-_"'“”‘’]/g, '').trim();
    }
    return (
        <>
            <Box sx={{ width: "100%", padding: 2, bgcolor: "transparent" }}>
                {/* Greeting text */}
                <Typography
                    variant="h6"

                    sx={{
                        mb: 2,
                        fontWeight: 500,
                        color: "#333",
                    }}
                >
                    {t(new Date().getHours() < 12 ? "welcome_user.morning" : "welcome_user.evening", {
                        name: user?.name,
                    })}
                </Typography>

                {/* Search bar with location */}
                <Paper
                    elevation={0}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: "2px 16px",
                        borderRadius: 28,
                        bgcolor: "#ffffff",
                        height: 56,
                    }}
                > {/* Search input */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ flex: 1, justifyContent: "flex-start" }}
                    >
                        <SearchIcon sx={{ color: "#555" }} />
                        <InputBase
                            placeholder={t("welcome_user.search_placeholder")}
                            sx={{
                                ml: 1,
                                flex: 1,
                                textAlign: "left",

                            }}
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </Stack>
                    {/* Location section */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        onClick={() => setIsDialogOpen(true)}
                        sx={{
                            bgcolor: "#0068FF30",
                            borderRadius: 16,
                            py: 0.5,
                            px: 2,
                            cursor: "pointer",
                        }}
                    >
                        <Typography sx={{ color: "#555", fontWeight: 500 }}>
                            {removePlusCode(location.address).slice(0, 15)}
                        </Typography>
                        {iconMap[location.type]}
                    </Stack>


                </Paper>
            </Box>

            {/* Bottom Sheet (Dialog) */}
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                fullWidth
                PaperProps={{
                    sx: {
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        with: "100vw",
                        background: "#ffffff",
                        m: 0,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                    },
                }}
            >
                <SelectLocationDialog onSelectLocation={setLocation} setIsDialogOpen={setIsDialogOpen} userId={user?.id || ""} />
            </Dialog>
        </>
    );
};

export default WelcomeUser;
