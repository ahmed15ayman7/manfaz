"use client"
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from "@mui/material"
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { useTranslations } from 'next-intl'

const navItems = [
  { href: '/services', label: 'services' },
  { href: '/stores', label: 'stores' },
  { href: '/categories', label: 'categories' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations()

  return (
    <header className="sticky top-0 px-3 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-4 rtl:space-x-reverse">
          <Image src="/logo.svg" alt="Manfaz" width={32} height={32} />
          <span className="text-xl font-bold">{t("manfaz")}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <motion.div
              key={item.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t(item.label)}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <LanguageToggle />
          
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outlined" component={Link} href="/login">
              {t('login')}
            </Button>
            <Button variant="contained" component={Link} href="/register">
              {t('register')}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outlined" size="small">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent  side="right">
              <nav className="flex flex-col space-y-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {t(item.label)}
                  </Link>
                ))}
                <hr className="my-4" />
                <Button variant="outlined" onClick={() => setIsOpen(false)} component={Link} href="/login" className="w-full justify-start">
                  {t('login')}
                </Button>
                <Button variant="contained" onClick={() => setIsOpen(false)} component={Link} href="/register" className="w-full justify-start">
                  {t('register')}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
} 