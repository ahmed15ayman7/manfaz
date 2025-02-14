'use client'
import { SidebarLinks } from '@/constant/icons'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl';

import React from 'react'
import { getUserData } from '@/lib/actions/user.action'

const Bottombar = () => {
    const t = useTranslations('');
  let pathname= usePathname();
  let {data:userData,isLoading} = useQuery({
    queryKey:['userData'],
    queryFn:()=>getUserData(),
  })
  return (
    <section className='bottombar'>
     <div className="bottombar_container">
      {SidebarLinks.map((link, index) => {
        let isActive=(pathname.includes(link.label)&&link.route.length>1)||pathname === link.route;
        if(link.route==='/profile') link.route=`/profile${!isLoading ? `?id=${userData?.id}`:""}`
        return(
        <Link key={index} href={link.route} className={`bottombar_link ${isActive && ' bg-primary-500'}`}>
            {link.icon}
            <span className=' text-black hidden sm:block'>{t(`bottom_nav.${link.label}`)}</span>
          </Link>
        )}
        )}
        </div>
    </section>
  )
}

export default Bottombar