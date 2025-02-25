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
import useCartStore from '@/store/useCartStore'
import { Badge } from '@mui/material'

const LeftSidebar = () => {
  let pathname= usePathname();
  let router = useRouter();
  let {data:userData,isLoading} = useQuery({
    queryKey:['user'],
    queryFn:()=> getUserData(),
  })
  let t = useTranslations('');
  let {items} = useCartStore();
  let [items2,setItems2] = React.useState(items);
  React.useEffect(()=>{
    setItems2(items);
  },[items])
  return (
    <section className='leftsidebar'>
      <div className=" flex flex-col gap-2 px-6 mb-auto">
      {SidebarLinks.map((link, index) =>{
        let isActive=(pathname.includes(link.label)&&link.route.length>1)||pathname === link.route;
      if(link.route==='/profile') link.route=`/profile${!isLoading ? `?id=${userData?.id}`:""}`
        return(
          <Link key={index} href={link.route} className={`relative leftsidebar_link ${isActive && ' bg-background'}`}>
            {link.icon}
            <span className=' text-black max-lg:hidden'>{t(`bottom_nav.${link.label}`)}</span>
            {items2.length > 0 && link.route=="/checkout" ? (
              <Badge style={{position:'absolute'}} className="absolute top-0 right-0 rounded-full px-2 translate-x-1/2 -translate-y-1/2  bg-primary text-white">{items2.length}</Badge>
            ):null}

          </Link>
        )
      }
      )}
        </div>
        <div className="px-10">
      
            <button onClick={async(e)=>{
              e.preventDefault();
              await SignOut();
              router.push('/login');
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