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
                    const response = await axios.get(`${apiUrl}/user-locations/${params.locationId}`);
                    setInitialData(response.data);
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
                await axios.put(`${apiUrl}/user-locations/${params.locationId}`, data);
            } else {
                // إضافة موقع جديد
                await axios.post(`${apiUrl}/user-locations/users/${params.userId}/locations`, data);
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