'use client'
import { SidebarLinks,sidebarLinksWorkers } from '@/constant/icons'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl';

import React from 'react'
import { getUserData } from '@/lib/actions/user.action'
import useCartStore from '@/store/useCartStore'
import { Badge } from '@mui/material'
import { useNotifications } from '@/hooks/useNotifications';
const Bottombar = ({isWorker}:{isWorker?:boolean}) => {
  const t = useTranslations('');
  let {notifications} = useNotifications();
  let pathname = usePathname();
  let { data: userData, isLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: () => getUserData(),
  })
  let { items } = useCartStore();
  let [items2, setItems2] = React.useState(items);
  React.useEffect(() => {
    setItems2(items);
  }, [items])
  let sidebarLinks=isWorker?sidebarLinksWorkers:SidebarLinks;
  return (
    <section className='bottombar'>
      <div className="bottombar_container">
        {sidebarLinks.map((link, index) => {
          let isActive = (pathname.includes(link.label) && link.route.length > 1) || pathname === link.route;
          if (link.route === '/profile') link.route = `/profile${!isLoading ? `?id=${userData?.id}` : ""}`
          return (
            <Link key={index} href={link.route} className={`relative bottombar_link text-black ${isActive && ' bg-primary text-white'}`}>
              {items2.length > 0 && link.route == "/checkout" ? (
                <Badge style={{ position: 'absolute' }} className=" top-0 right-0 rounded-full px-2 translate-x-1/2 -translate-y-1/2  bg-primary text-white border-2 border-white">{items2.length}</Badge>
              ) : null}
              {notifications.length > 0 && (link.route == "/notification"||link.route == "/worker/notification") ? (
                <Badge style={{ position: 'absolute' }} className=" top-0 right-0 rounded-full px-2 translate-x-1/2 -translate-y-1/2  bg-primary text-white border-2 border-white">{notifications.length}</Badge>
              ) : null}
              {link.icon}
              <span className='  hidden sm:block'>{t(`bottom_nav.${link.label}`)}</span>
            </Link>
          )
        }
        )}
      </div>
    </section>
  )
}

export default Bottombar