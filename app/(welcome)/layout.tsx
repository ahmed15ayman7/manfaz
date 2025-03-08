"use client"
import { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import IntlProvider from '@/components/providers/IntlProvider'

interface WelcomeLayoutProps {
  children: ReactNode
}

export default function WelcomeLayout({ children }: WelcomeLayoutProps) {
  return (
    <IntlProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <AnimatePresence mode="wait">
          <motion.main 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </IntlProvider>
  )
} 