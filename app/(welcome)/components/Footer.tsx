"use client"
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/manfaz' },
  { icon: Instagram, href: 'https://instagram.com/manfaz' },
  { icon: Twitter, href: 'https://twitter.com/manfaz' },
  { icon: Youtube, href: 'https://youtube.com/manfaz' },
]

const footerLinks = [
  {
    title: 'company',
    links: [
      { label: 'about', href: '/about' },
      { label: 'contact', href: '/contact' },
      { label: 'careers', href: '/careers' },
    ],
  },
  {
    title: 'services',
    links: [
      { label: 'delivery', href: '/services/delivery' },
      { label: 'home_services', href: '/services/home' },
      { label: 'car_maintenance', href: '/services/car' },
    ],
  },
  {
    title: 'legal',
    links: [
      { label: 'terms', href: '/terms' },
      { label: 'privacy', href: '/privacy' },
      { label: 'cookies', href: '/cookies' },
    ],
  },
]

export default function Footer() {
  const t = useTranslations()

  return (
    <footer className="bg-background border-t flex justify-center">
      <div className="container p-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {/* Logo and Social Links */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold">
            {t("manfaz")}
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {t(`footer.${section.title}`)}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t(`footer.${link.label}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
} 