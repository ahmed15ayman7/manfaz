import { Card, CardContent, Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';

const StoreCardSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <Box sx={{ position: 'relative' }}>
                    <Skeleton
                        variant="rectangular"
                        height={140}
                        animation="wave"
                    />
                    <Skeleton
                        variant="circular"
                        width={60}
                        height={60}
                        sx={{
                            position: 'absolute',
                            bottom: -30,
                            left: 20,
                            border: '3px solid #fff',
                        }}
                    />
                </Box>
                <CardContent sx={{ pt: 4 }}>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Skeleton variant="rectangular" width={100} height={20} />
                        <Skeleton variant="text" width={40} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Skeleton variant="circular" width={16} height={16} />
                        <Skeleton variant="text" width="40%" />
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default StoreCardSkeleton; 