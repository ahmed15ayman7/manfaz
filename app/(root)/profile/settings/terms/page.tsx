"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { IconFileText, IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';

const sections = [
    { id: 'section1', title: 'terms.section1.title', content: 'terms.section1.content' },
    { id: 'section2', title: 'terms.section2.title', content: 'terms.section2.content' },
    { id: 'section3', title: 'terms.section3.title', content: 'terms.section3.content' },
    { id: 'section4', title: 'terms.section4.title', content: 'terms.section4.content' }
];

export default function TermsPage() {
    const t = useTranslations();
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box sx={{ py: 4, px: 2 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box display="flex" alignItems="center" mb={4}>
                    <IconFileText size={32} style={{ marginRight: 16 }} />
                    <Typography variant="h5">
                        {t('profile_tab.terms')}
                    </Typography>
                </Box>

                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)'
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
                        {t('terms.title')}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                            {t('terms.introduction')}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Accordion
                                expanded={expanded === section.id}
                                onChange={handleChange(section.id)}
                                sx={{
                                    mb: 2,
                                    '&:before': { display: 'none' },
                                    boxShadow: 'none',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: '8px !important',
                                    '&.Mui-expanded': {
                                        margin: '0 0 16px 0'
                                    }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<IconChevronDown />}
                                    sx={{
                                        '& .MuiAccordionSummary-content': {
                                            margin: '12px 0'
                                        }
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        {t(section.title)}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1" paragraph>
                                        {t(section.content)}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </motion.div>
                    ))}

                    <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                        <Typography variant="body2" color="info.contrastText">
                            {t('terms.last_updated')}: {new Date().toLocaleDateString('ar-EG')}
                        </Typography>
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
} 