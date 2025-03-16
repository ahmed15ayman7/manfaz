"use client"
import Image from 'next/image'
import Link from 'next/link'
import LanguageToggle from '../ui/LanguageToggle'
import { useTranslations } from 'next-intl';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { ProfilePopover } from './profile-popover';
import { redirect } from 'next/navigation';
const Topbar = ({ isWorker }: { isWorker?: boolean }) => {
  let t = useTranslations();
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, status } = useUser()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsProfileOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsProfileOpen(false);
  };
  useEffect(() => {
    if (status !== "loading") {
      // isWorker && user?.role === "user" ? redirect("/home") : user?.role === "worker" ? redirect("/worker") : redirect("/")
    }

  }, [user])
  return (
    <section className='topbar'>
      <div className='w-full px-5'>
        <div className=' flex flex-row justify-between'>
          <Link href="/" className=' flex items-center  w-1/5  max-xl:w-1/2  g-3  no-underline text-body-bold text-black' >
            <Image src="/assets/images/manfaz_logo.png" alt='' width={50} height={50} />
            <div className="flex flex-col justify-center items-center relative p-3 max-xl:pl-0">
              <p className='text-2xl max-xl:text-base font-bold'>{t('manfaz')}</p>
              {isWorker && <p className='text-xs max-xl:text-xs text-primary-dark absolute right-0 bottom-0 -translate-x-100 translate-y-100'>{t('worker')}</p>}
            </div>
          </Link>
          {status !== "loading" && user?.role && user && <Avatar
            onClick={handleClick}
            src={user?.imageUrl}
            alt={user?.name}
            sx={{
              width: 48,
              cursor: 'pointer',
              height: 48,
              bgcolor: 'primary.dark',
              border: '2px solid',
              borderColor: 'primary.light',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            {user?.name?.[0]}
          </Avatar>}
          <ProfilePopover open={isProfileOpen} anchorEl={anchorEl} onClose={handleClose} user={user} />
          {/* <LanguageToggle /> */}
        </div>
      </div>
    </section>
  )
}

export default Topbar