
import Image from 'next/image'
import Link from 'next/link'
import LanguageToggle from '../ui/LanguageToggle'
import { useTranslations } from 'next-intl';
const Topbar = ({ isWorker }: { isWorker?: boolean}) => {
  let t = useTranslations();
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
          <LanguageToggle />
        </div>
      </div>
    </section>
  )
}

export default Topbar