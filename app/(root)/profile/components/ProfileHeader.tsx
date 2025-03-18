"use client";

import { useState } from "react";
import { Box, Typography, Avatar, IconButton, Tooltip } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import ImageUploadModal from "./ImageUploadModal";
import { User } from "@/interfaces";

interface ProfileHeaderProps {
  user: User | undefined;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  if (!user) return null;

  return (
    <Box sx={{ mb: 4, textAlign: "center" }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            src={user.imageUrl}
            alt={user.name}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid",
              borderColor: "primary.main",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          />
          <Tooltip title="تغيير الصورة">
            <IconButton
              onClick={() => setIsImageModalOpen(true)}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "background.paper",
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
          {user.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {user.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.phone}
        </Typography>
      </motion.div>

      <ImageUploadModal
        open={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        userId={user.id}
      />
    </Box>
  );
} 