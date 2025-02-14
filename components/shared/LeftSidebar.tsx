'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { useTranslations } from 'next-intl';
import { getUserData, SignOut } from '@/lib/actions/user.action'
import { useQuery } from '@tanstack/react-query'
import { IconLogout } from '@tabler/icons-react'
import { SidebarLinks } from '@/constant/icons'

const LeftSidebar = () => {
  let pathname= usePathname();
  let router = useRouter();
  let {data:userData,isLoading} = useQuery({
    queryKey:['user'],
    queryFn:()=> getUserData(),
  })
  let t = useTranslations('');
  return (
    <section className='leftsidebar'>
      <div className=" flex flex-col gap-2 px-6 mb-auto">
      {SidebarLinks.map((link, index) =>{
        let isActive=(pathname.includes(link.label)&&link.route.length>1)||pathname === link.route;
        console.log(isActive,link.route,pathname,pathname.includes(link.route));
      if(link.route==='/profile') link.route=`/profile${!isLoading ? `?id=${userData?.id}`:""}`
        return(
          <Link key={index} href={link.route} className={`leftsidebar_link ${isActive && ' bg-background'}`}>
            {link.icon}
            <span className=' text-black max-lg:hidden'>{t(`bottom_nav.${link.label}`)}</span>
          </Link>
        )
      }
      )}
        </div>
        <div className="px-10">
      
            <button onClick={async(e)=>{
              e.preventDefault();
              await SignOut();
              router.push('/sign-in');
            }}>
              <div className="flex gap-4 cursor-pointer">
                <IconLogout size={24} />
                <span className=' text-black  max-lg:hidden'>{t('logout')}</span>
              </div>
            </button>

        </div>
    </section>
  )
}

export default LeftSidebar