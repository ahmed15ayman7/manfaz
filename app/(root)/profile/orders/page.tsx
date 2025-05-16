
'use client';
import { useTranslations } from 'next-intl';
export default function OrdersPage() {
    const t = useTranslations();
    return <div>{t('profile_tab.orders')} - Orders Page</div>;
} 