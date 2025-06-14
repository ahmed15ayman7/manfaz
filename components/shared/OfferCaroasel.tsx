"use client"
import {
    Card,
    CardContent,
    CardMedia,
    Box as MUIBox,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/lib/apis";
import { StoreOffer } from "@/interfaces";
import Loading from "@/components/shared/Loading";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import { useLocationStore } from "@/store/useLocationStore";
// Data for the offer cards
const offerCards = [
    {
        id: 1,
        title: "عصائر و مثلجات",
        image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
        alt: "Juices and Ice Cream",
    },
    {
        id: 2,
        title: "عصائر و مثلجات",
        image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
        alt: "Juices and Ice Cream",
    },
    {
        id: 3,
        title: "عصائر و مثلجات",
        image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
        alt: "Juices and Ice Cream",
    },
    {
        id: 4,
        title: "عصائر و مثلجات",
        image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
        alt: "Juices and Ice Cream",
    },
    {
        id: 5,
        title: "عصائر و مثلجات",
        image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
        alt: "Juices and Ice Cream",
    },
    {
        id: 6,
        title: "عصائر و مثلجات",
        image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
        alt: "Juices and Ice Cream",
    },
    {
        id: 7,
        title: "عروض مرسول",
        image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
        alt: "Delivery Offers",
    },
    {
        id: 8,
        title: "كوبونات خصم",
        image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
        alt: "Discount Coupons",
    },
];
const getOffers = async (userLocation: { latitude: number; longitude: number } | null, locale: string) => {
    const res = await axiosInstance.get(API_ENDPOINTS.offers.getAll({ latitude: userLocation?.latitude, longitude: userLocation?.longitude, take: 10, lang: locale }, true))
    return res.data.data
}
const OfferCaroasel = () => {
    let { userLocation } = useLocationStore()
    let router = useRouter()
    let locale = useLocale()
    const { data: offers, isLoading, isError, refetch } = useQuery<StoreOffer[]>({
        queryKey: ['offers'],
        queryFn: () => getOffers(userLocation, locale),
        enabled: !!userLocation
    })
    const t = useTranslations();
    useEffect(() => {
        refetch()
    }, [locale])
    if (isLoading)
        return null
    //  <MUIBox sx={{ width: "100%", maxWidth: "90vw", overflow: "hidden" }}>
    //     <Typography
    //         variant="h5"
    //         component="h1"
    //         sx={{
    //             textAlign: "right",
    //             mb: 2,
    //             fontWeight: "bold",
    //             px: 2,
    //             pt: 10,
    //         }}
    //     >
    //         {t("offers.title")}
    //     </Typography>
    //     <Skeleton
    //         variant="rectangular"
    //         className="max-sm:max-w-[100vw] max-md:max-w-[90vw] max-w-[80vw]"
    //         sx={{
    //             display: 'flex',
    //             gap: 1,
    //             py: 1,
    //             overflow: 'auto',
    //             width: "100%",
    //             scrollSnapType: 'x mandatory',
    //             '& > *': {
    //                 scrollSnapAlign: 'center',
    //             },
    //             '::-webkit-scrollbar': { display: 'none' },
    //         }}
    //     >
    //         {Array.from({ length: 10 }).map((_, index) => (
    //             <Card
    //                 key={index}
    //                 sx={{
    //                     minWidth: 240,
    //                     borderRadius: 4,
    //                     boxShadow: 3,
    //                     position: "relative",
    //                 }}
    //             >
    //                 <Skeleton
    //                     variant="rectangular"
    //                     height="140"
    //                     sx={{ objectFit: "cover" }}
    //                 />
    //                 <Skeleton
    //                     sx={{
    //                         position: "absolute",
    //                         bottom: 0,
    //                         width: "100%",
    //                         background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
    //                         p: 2,
    //                     }}
    //                 >
    //                     <Skeleton
    //                         variant="text"
    //                         width="100%"
    //                         height="24px"
    //                     />
    //                 </Skeleton>
    //             </Card>
    //         ))}
    //     </Skeleton>
    // </MUIBox>
    if (isError) return <Alert severity="error">{t("error")}</Alert>
    return (
        <MUIBox sx={{ width: "100%", maxWidth: "100vw", overflow: "hidden", pt: 4 }}>
            <Typography
                variant="h5"
                component="h1"
                sx={{
                    textAlign: "right",
                    mb: 2,
                    fontWeight: "bold",
                    px: 2,
                }}
                className="max-xl:hidden pt-10"
            >
                {t("offers.title")}
            </Typography>
            <MUIBox
                className="max-sm:max-w-[100vw] max-md:max-w-[90vw] max-w-[80vw] max-xl:pt-10"
                sx={{
                    display: 'flex',
                    gap: 1,
                    py: 1,
                    overflow: 'auto',
                    width: "100%",
                    scrollSnapType: 'x mandatory',
                    '& > *': {
                        scrollSnapAlign: 'center',
                    },
                    '::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {offers?.map((offer, index) => (
                    <Card
                        key={index}
                        sx={{
                            borderRadius: 4,
                            boxShadow: 3,
                            position: "relative",
                            cursor: "pointer",
                        }}
                        className="max-xl:min-w-[160px] max-xl:max-w-[160px] min-w-[240px] max-w-[240px]"
                        onClick={() => {
                            router.push(`/offers/${offer.id}`)
                        }}
                    >
                        <CardMedia
                            component="img"
                            height="140"
                            width="100%"
                            image={offer.image as string}
                            alt={offer.name}
                            sx={{ objectFit: "cover" }}
                        />
                        <CardContent
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                width: "100%",
                                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                                p: 2,
                            }}
                        >
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    color: "white",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                }}
                            >
                                {offer.name}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </MUIBox>
        </MUIBox>
    );
};

export default OfferCaroasel;