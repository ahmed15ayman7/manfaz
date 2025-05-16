
'use client';
import { useTranslations } from 'next-intl';
export default function WalletPage() {
    const t = useTranslations();
    return <div>{t('profile_tab.wallet')} - Wallet Page</div>;
} 