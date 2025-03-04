import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface LocationStore {
    userLocation: Coordinates | null;
    setUserLocation: (location: Coordinates) => void;
    calculateDistance: (storeLocation: Coordinates) => number;
}

export const useLocationStore = create<LocationStore>()(
    persist(
        (set, get) => ({
            userLocation: null,
            setUserLocation: (location) => set({ userLocation: location }),
            calculateDistance: (storeLocation) => {
                const userLoc = get().userLocation;
                if (!userLoc) return 0;

                // حساب المسافة باستخدام صيغة هافرساين
                const R = 6371; // نصف قطر الأرض بالكيلومترات
                const dLat = toRad(storeLocation.latitude - userLoc.latitude);
                const dLon = toRad(storeLocation.longitude - userLoc.longitude);

                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(toRad(userLoc.latitude)) * Math.cos(toRad(storeLocation.latitude)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);

                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = R * c;

                return Math.round(distance * 10) / 10; // تقريب لأقرب 0.1 كم
            }
        }),
        {
            name: 'user-location',
        }
    )
);

// تحويل الدرجات إلى راديان
const toRad = (degrees: number) => degrees * Math.PI / 180; 