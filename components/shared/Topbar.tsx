
import Image from 'next/image'
import Link from 'next/link'
import LanguageToggle from '../ui/LanguageToggle'
const Topbar = () => {
  return (
    <section className='topbar'>
        <div className='container'>
            <div className=' flex flex-row justify-between'>
                <Link href="/" className=' flex items-center justify-between w-1/12  g-3  no-underline text-body-bold text-black' >
                  <Image src="/assets/images/manfaz_logo.png" alt='' width={50} height={50} />
                  <p className=' max-md:hidden '>Manfaz</p></Link>
            <LanguageToggle/>
            </div>
        </div>
    </section>
  )
}

export default Topbar