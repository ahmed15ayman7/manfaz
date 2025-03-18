"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import API_ENDPOINTS from "@/lib/apis";
import { Cropper as CropperType } from "cropperjs";

interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export default function ImageUploadModal({
  open,
  onClose,
  userId,
}: ImageUploadModalProps) {
  const [image, setImage] = useState<string | null>(null);
  const [cropper, setCropper] = useState<CropperType | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadImage, isPending } = useMutation({
    mutationFn: async (croppedImage: Blob) => {
      const formData = new FormData();
      formData.append("file", croppedImage);
      formData.append("upload_preset", "your_upload_preset"); // قم بتغييره حسب إعدادات Cloudinary

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total!) * 100;
            setUploadProgress(progress);
          },
        }
      );

      return response.data.secure_url;
    },
    onSuccess: async (imageUrl) => {
      await axios.patch(API_ENDPOINTS.users.update(userId), {
        imageUrl,
      });
      onClose();
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob: Blob) => {
        uploadImage(blob);
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>تغيير الصورة الشخصية</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            sx={{ mb: 2 }}
          >
            اختيار صورة
          </Button>

          <AnimatePresence>
            {image && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Box sx={{ height: 400 }}>
                  <Cropper
                    src={image}
                    style={{ height: "100%", width: "100%" }}
                    aspectRatio={1}
                    guides={true}
                    onInitialized={(instance) => setCropper(instance)}
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {isPending && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <CircularProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                جاري رفع الصورة... {Math.round(uploadProgress)}%
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button
          variant="contained"
          onClick={handleCrop}
          disabled={!image || isPending}
        >
          حفظ
        </Button>
      </DialogActions>
    </Dialog>
  );
} 