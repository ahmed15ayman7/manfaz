import React, { useState } from "react";
import { Box, Typography, Paper, Button, Switch, TextField, IconButton } from "@mui/material";
import { useTranslations, useLocale } from 'next-intl';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import HotelIcon from '@mui/icons-material/Hotel';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { ClubIcon, PartyPopperIcon, SchoolIcon } from "lucide-react";

interface SaveLocationDetailsProps {
    address: string;
    onSave: (data: any) => void;
    onCancel?: () => void;
}

const locationTypes = [
    { key: 'home', icon: <HomeIcon />, color: '#fffbe8' },
    { key: 'work', icon: <WorkIcon />, color: '#fffbe8' },
    { key: 'hotel', icon: <HotelIcon />, color: '#fffbe8' },
    { key: "party", icon: <PartyPopperIcon />, color: '#fffbe8' },
    { key: "school", icon: <SchoolIcon />, color: '#fffbe8' },
    { key: "club", icon: <ClubIcon />, color: '#fffbe8' },
];

export default function SaveLocationDetails({ address, onSave, onCancel }: SaveLocationDetailsProps) {
    const t = useTranslations('save_location');
    const locale = useLocale();
    const isRTL = locale === 'ar' || locale === 'ur';

    const [details, setDetails] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [saveForLater, setSaveForLater] = useState(false);
    const [locationType, setLocationType] = useState('home');
    const [customName, setCustomName] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSave = () => {
        onSave({ address, details, image, saveForLater, locationType, customName });
    };

    return (
        <Box sx={{ p: 2, direction: isRTL ? 'rtl' : 'ltr' }}>
            <Paper sx={{ p: 2, borderRadius: 3, mb: 2, background: '#F8F8F8' }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <span style={{ color: '#43B96F', fontSize: 22 }}>📍</span>
                    <Typography fontWeight="bold" fontSize={18} sx={{ wordBreak: 'break-word' }}>{address}</Typography>
                </Box>
                <Box mt={2} mb={1}>
                    <Typography color="#888" fontSize={15}>{t('extra_details')}</Typography>
                    <Typography color="#888" fontSize={13}>{t('extra_details_hint')}</Typography>
                </Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder={t('extra_details_placeholder')}
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    sx={{ mb: 1, background: '#fff', borderRadius: 2 }}
                />
                <Button
                    component="label"
                    startIcon={<AddAPhotoIcon />}
                    className="text-primary hover:text-primary/90"
                    sx={{ fontWeight: 'bold', mb: 1, display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-start" }}
                >
                    {t('add_photo')}
                    <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </Button>
                {image && <Typography fontSize={13} color="#888">{image.name}</Typography>}
            </Paper>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography fontWeight="bold" fontSize={16}>{t('save_for_later')}</Typography>
                <Switch checked={saveForLater} onChange={() => setSaveForLater(!saveForLater)} color="info" />
            </Box>
            {saveForLater && <Box display="flex" gap={1} mb={2} sx={{ overflowX: "auto", scrollbarWidth: "none", py: "5px" }}>
                {locationTypes.map(type => (
                    <Button
                        key={type.key}
                        variant={locationType === type.key ? 'contained' : 'outlined'}
                        onClick={() => setLocationType(type.key)}
                        sx={{
                            px: 2,
                            background: locationType === type.key ? type.color : '#fff',
                            color: locationType === type.key ? '#FFD600' : '#222',
                            border: locationType === type.key ? '1px solid #FFD600' : 'none',
                            fontWeight: 'bold',
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            minWidth: "100px",
                            justifyContent: "flex-start"
                        }}
                        startIcon={type.icon}
                    >
                        <Typography fontSize={13} color="#222">{t(type.key)}</Typography>
                    </Button>
                ))}
            </Box>}
            {saveForLater &&
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder={t('custom_name_placeholder')}
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    sx={{ mb: 2, background: '#fff', borderRadius: 2 }}
                />}
            <Button
                fullWidth
                variant="contained"
                className="bg-primary hover:bg-primary/90"
                sx={{ color: '#fff', fontWeight: 'bold', fontSize: 20, borderRadius: 2, py: 1.5 }}
                onClick={handleSave}
            >
                {t('save_location')}
            </Button>
            {onCancel && <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={onCancel}>{t('cancel')}</Button>}
        </Box>
    );
} 