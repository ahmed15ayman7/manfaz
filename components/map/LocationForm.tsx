"use client"
import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    Alert
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { UserLocation } from '@/interfaces';
import LocationMap from './LocationMap';

interface LocationFormProps {
    onSubmit: (data: Partial<UserLocation>) => Promise<void>;
    initialData?: Partial<UserLocation>;
    isEdit?: boolean;
}

const LocationForm = ({ onSubmit, initialData, isEdit }: LocationFormProps) => {
    const t = useTranslations();
    const [formData, setFormData] = useState<Partial<UserLocation>>(initialData || {
        name: '',
        type: 'home',
        address: '',
        apartment: '',
        floor: '',
        building: '',
        street: '',
        area: '',
        city: '',
        latitude: 0,
        longitude: 0,
        isDefault: false,
        notes: ''
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleLocationSelect = (location: { lat: number; lng: number }) => {
        setFormData(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSubmit(formData);
        } catch (err) {
            setError(t('location.save_error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <LocationMap
                onLocationSelect={handleLocationSelect}
                initialLocation={
                    initialData?.latitude && initialData?.longitude
                        ? { lat: initialData.latitude, lng: initialData.longitude }
                        : undefined
                }
            />

            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={t('location.name')}
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                        <InputLabel>{t('location.type')}</InputLabel>
                        <Select
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as "home" | "work" | "club" | "hotel" | "school" | "party" }))}
                        >
                            <MenuItem value="home">{t('location.type_home')}</MenuItem>
                            <MenuItem value="work">{t('location.type_work')}</MenuItem>
                            <MenuItem value="club">{t('location.type_club')}</MenuItem>
                            <MenuItem value="hotel">{t('location.type_hotel')}</MenuItem>
                            <MenuItem value="school">{t('location.type_school')}</MenuItem>
                            <MenuItem value="party">{t('location.type_party')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label={t('location.address')}
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        required
                        multiline
                        rows={2}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={t('location.building')}
                        value={formData.building}
                        onChange={(e) => setFormData(prev => ({ ...prev, building: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={t('location.apartment')}
                        value={formData.apartment}
                        onChange={(e) => setFormData(prev => ({ ...prev, apartment: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={t('location.floor')}
                        value={formData.floor}
                        onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={t('location.street')}
                        value={formData.street}
                        onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={t('location.area')}
                        value={formData.area}
                        onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={t('location.city')}
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label={t('location.notes')}
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        multiline
                        rows={2}
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    {isEdit ? t('common.save') : t('location.add_location')}
                </Button>
            </Box>
        </Box>
    );
};

export default LocationForm; 