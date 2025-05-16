"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { motion } from 'framer-motion';
import { IconLanguage } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const languages = [
    { code: 'ar', name: 'العربية' },
    { code: 'en', name: 'English' },
    { code: 'ur', name: 'اردو' }
];

export default function LanguagePage() {
    const t = useTranslations();
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState('ar');

    const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLanguage = event.target.value;
        setSelectedLanguage(newLanguage);
        // هنا يمكن إضافة منطق تغيير اللغة
        // router.push(`/${newLanguage}/profile/settings/language`);
    };

    return (
        <Box sx={{ py: 4, px: 2 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box display="flex" alignItems="center" mb={4}>
                    <IconLanguage size={32} style={{ marginRight: 16 }} />
                    <Typography variant="h5">
                        {t('profile_tab.language')}
                    </Typography>
                </Box>

                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 2
                    }}
                >
                    <FormControl component="fieldset">
                        <RadioGroup
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                        >
                            {languages.map((lang) => (
                                <FormControlLabel
                                    key={lang.code}
                                    value={lang.code}
                                    control={
                                        <Radio
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: 'primary.main'
                                                }
                                            }}
                                        />
                                    }
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <Typography variant="body1">
                                                {lang.name}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{
                                        mb: 2,
                                        '&:last-child': {
                                            mb: 0
                                        }
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                // هنا يمكن إضافة منطق حفظ اللغة
                                router.back();
                            }}
                        >
                            {t('common.save')}
                        </Button>
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
} 