
'use client';
import { useTranslations } from 'next-intl';
export default function EditProfilePage() {
    const t = useTranslations();
    return <div>{t('worker_settings.personal_info')} - Edit Profile Page</div>;
} 