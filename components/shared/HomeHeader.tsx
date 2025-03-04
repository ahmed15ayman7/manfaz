import { Typography } from "@mui/material";
import { IconLocation } from "@tabler/icons-react"
import { useLocationStore } from "@/store/useLocationStore";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import { User } from "@/interfaces";
import { useTranslations } from "next-intl";
const HomeHeader = ({ user, isLoading }: { user: User, isLoading: boolean }) => {
  const { userLocation } = useLocationStore();
  const [address, setAddress] = useState<string>('');
  let t = useTranslations('home');

  useEffect(() => {
    const getAddressFromCoords = async () => {
      if (userLocation?.latitude && userLocation?.longitude) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.latitude},${userLocation.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          if (data.results && data.results[0]) {
            setAddress(data.results[0].formatted_address);
          }
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      }
    };

    getAddressFromCoords();
  }, [userLocation]);
  console.log(user);
  return (
    <div className="bg-blue-600 text-white p-4 rounded-b-2xl absolute top-20 left-0 right-0">
      <Link href={`/user-locations/${isLoading ? '' : user.id}`} className="flex items-center gap-2">
        <IconLocation size={20} />
        <Typography variant="body2" className="font-medium">
          {address}
        </Typography>
      </Link>
      <Typography variant="h5" className="font-bold mt-2">
        {t('good_morning')} {isLoading ? '' : user.name}
      </Typography>
    </div>
  );
};

export default HomeHeader;
