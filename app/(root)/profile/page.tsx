"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Box, Container, Paper, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import API_ENDPOINTS from "@/lib/apis";
import axios from "axios";
import { User } from "@/interfaces";
import ProfileForm from "./components/ProfileForm";
import ProfileHeader from "./components/ProfileHeader";
import ProfileProgress from "./components/ProfileProgress";
import { useSnackbar } from "@/hooks/useSnackbar";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const { showSnackbar } = useSnackbar();
  const [profileCompletion, setProfileCompletion] = useState(0);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await axios.get(API_ENDPOINTS.users.getById(userId || "",{}));
      return response.data as User;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (user) {
      calculateProfileCompletion(user);
    }
  }, [user]);

  const calculateProfileCompletion = (user: User) => {
    let completion = 0;
    const fields = [
      user.name,
      user.email,
      user.phone,
      user.imageUrl,
      user.locations?.length > 0,
    ];
    
    completion = (fields.filter(Boolean).length / fields.length) * 100;
    setProfileCompletion(completion);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    showSnackbar("حدث خطأ أثناء تحميل البيانات", "error");
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
          <ProfileHeader user={user} />
          <ProfileProgress value={profileCompletion} />
          <ProfileForm user={user} />
        </Paper>
      </motion.div>
    </Container>
  );
}
