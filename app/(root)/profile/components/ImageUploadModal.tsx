"use client";

import React, { useState, useRef } from "react";
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
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import API_ENDPOINTS from "@/lib/apis";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  refetch: () => void;
}

export default function ImageUploadModal({
  open,
  onClose,
  refetch,
  userId,
}: ImageUploadModalProps) {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { mutate: uploadImage, isPending } = useMutation({
    mutationFn: async (croppedImage: Blob) => {
    const formData = new FormData();
formData.append('file', croppedImage);
formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!); // لو عندك preset
formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
formData.append('timestamp', (Date.now() / 1000).toString()); // timestamp مهم في بعض الحالات

const response = await axios.post(
  `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
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
      try {
        await axiosInstance.put(API_ENDPOINTS.users.update(userId, {},false), {
          imageUrl: imageUrl,
        });
        toast.success("تم تحديث الصورة الشخصية بنجاح");
        refetch();
        onClose();
      } catch (error) {
        toast.error("حدث خطأ أثناء تحديث الصورة الشخصية");
      }
    },
    onError: () => {
      toast.error("حدث خطأ أثناء رفع الصورة");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
  
    const cropWidth = Math.round(crop.width);
    const cropHeight = Math.round(crop.height);
  
    canvas.width = cropWidth;
    canvas.height = cropHeight;
  
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("No 2D context");
    }
  
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      cropWidth,
      cropHeight
    );
  
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas is empty or failed to create blob."));
        }
      }, "image/jpeg");
    });
  };
  

  const handleCrop = async () => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImage = await getCroppedImg(imgRef.current, crop as PixelCrop);
      uploadImage(croppedImage);
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
                <Box sx={{ height: 400, position: "relative" }}>
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    aspect={1}
                    circularCrop
                  >
                    <img
                      ref={imgRef}
                      src={image}
                      alt="Crop me"
                      style={{ maxHeight: "100%", width: "auto" }}
                    />
                  </ReactCrop>
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