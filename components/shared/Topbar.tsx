
import Image from 'next/image'
import Link from 'next/link'
import LanguageToggle from '../ui/LanguageToggle'
import { useTranslations } from 'next-intl';
const Topbar = () => {
  let t = useTranslations();
  return (
    <section className='topbar'>
      <div className='w-full px-5'>
        <div className=' flex flex-row justify-between'>
          <Link href="/" className=' flex items-center  w-1/5  max-xl:w-1/2  g-3  no-underline text-body-bold text-black' >
            <Image src="/assets/images/manfaz_logo.png" alt='' width={50} height={50} />

            <p className='text-2xl max-xl:text-base font-bold'>{t('manfaz')}</p></Link>
          <LanguageToggle />
        </div>
      </div>
    </section>
  )
}

export default Topbar