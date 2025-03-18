"use client";

import { Box, LinearProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface ProfileProgressProps {
  value: number;
}

export default function ProfileProgress({ value }: ProfileProgressProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          اكتمال الملف الشخصي
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Math.round(value)}%
        </Typography>
      </Box>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.5 }}
      >
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "grey.200",
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
              backgroundColor: "primary.main",
            },
          }}
        />
      </motion.div>
    </Box>
  );
} 