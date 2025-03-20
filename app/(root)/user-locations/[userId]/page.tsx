"use client"
import { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { apiUrl } from '@/constant';
import LocationForm from '@/components/map/LocationForm';
import { UserLocation } from '@/interfaces';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import API_ENDPOINTS from '@/lib/apis';

const UserLocationPage = () => {
    const t = useTranslations();
    const params = useParams();
    const router = useRouter();
    const [initialData, setInitialData] = useState<Partial<UserLocation> | undefined>();

    useEffect(() => {
        // إذا كان هناك معرف موقع، قم بتحميل البيانات
        if (params.locationId) {
            const fetchLocation = async () => {
                try {
                    const response = await axiosInstance.get(API_ENDPOINTS.userLocations.getAll(params.userId as string,{},false));
                    setInitialData(response.data.data?.[0]);
                } catch (error) {
                    console.error('Error fetching location:', error);
                }
            };
            fetchLocation();
        }
    }, [params.locationId]);

    const handleSubmit = async (data: Partial<UserLocation>) => {
        try {
            if (params.locationId) {
                // تحديث موقع موجود
                await axios.put(API_ENDPOINTS.userLocations.update(params.locationId as string, data), data);
            } else {
                // إضافة موقع جديد
                await axios.post(API_ENDPOINTS.userLocations.create(params.userId as string, data), data);
            }
            router.push('/profile'); // أو أي مسار آخر تريد التوجيه إليه
        } catch (error) {
            console.error('Error saving location:', error);
            throw error;
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {params.locationId ? t('location.edit_location') : t('location.add_location')}
                </Typography>
                <LocationForm
                    onSubmit={handleSubmit}
                    initialData={initialData}
                    isEdit={!!params.locationId}
                />
            </Box>
        </Container>
    );
};

export default UserLocationPage; 