"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  User,
  AtSign,
  FileText,
  ArrowRight
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { Input } from '@mui/material'
import { Button } from '@mui/material'
import Link from 'next/link'
import { Textarea } from '@headlessui/react'

const contactInfo = [
  {
    icon: Phone,
    title: 'contact.phone.title',
    content: 'contact.phone.content',
    action: 'contact.phone.action',
    href: 'tel:+966500000000',
    color: 'blue'
  },
  {
    icon: Mail,
    title: 'contact.email.title',
    content: 'contact.email.content',
    action: 'contact.email.action',
    href: 'mailto:support@manfath.com',
    color: 'green'
  },
  {
    icon: MapPin,
    title: 'contact.address.title',
    content: 'contact.address.content',
    action: 'contact.address.action',
    href: 'https://maps.google.com',
    color: 'orange'
  },
  {
    icon: Clock,
    title: 'contact.hours.title',
    content: 'contact.hours.content',
    action: 'contact.hours.action',
    href: '/faq',
    color: 'purple'
  }
]

const topics = [
  {
    id: 'general',
    icon: MessageSquare,
    label: 'contact.topics.general'
  },
  {
    id: 'technical',
    icon: Building2,
    label: 'contact.topics.technical'
  },
  {
    id: 'partnership',
    icon: User,
    label: 'contact.topics.partnership'
  }
]

export default function ContactPage() {
  const t = useTranslations()
  const [selectedTopic, setSelectedTopic] = useState('general')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white',
      green: 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white',
      orange: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white',
      purple: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // هنا يتم إرسال البيانات إلى الخادم
    console.log('Form submitted:', { ...formData, topic: selectedTopic })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* الهيدر الرئيسي */}
      <div className="relative h-[40vh] min-h-[400px] bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/contact/pattern.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary" />
        <div className=" relative z-10 h-full flex flex-col items-center justify-center text-primary-foreground">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-center"
          >
            {t('contact.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl text-center"
          >
            {t('contact.description')}
          </motion.p>
        </div>
      </div>

      <div className=" py-12">
        {/* معلومات التواصل */}
        <AnimatedSection className="relative -mt-24 mb-12 z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map(({ icon: Icon, title, content, action, href, color }) => (
              <motion.a
                key={title}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                whileHover={{ y: -5 }}
                className="block"
              >
                <div className="bg-card rounded-xl p-6 h-full">
                  <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${getColorClasses(color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t(title)}</h3>
                  <p className="text-muted-foreground mb-4">{t(content)}</p>
                  <span className="inline-flex items-center gap-2 text-primary hover:underline">
                    <span>{t(action)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* نموذج التواصل */}
          <AnimatedSection>
            <div className="bg-card rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">
                {t('contact.form.title')}
              </h2>

              {/* اختيار الموضوع */}
              <div className="flex flex-wrap gap-4 mb-6">
                {topics.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedTopic(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      selectedTopic === id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t(label)}</span>
                  </button>
                ))}
              </div>

              {/* نموذج الاتصال */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('contact.form.name')}
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contact.form.name_placeholder')}
                      className="pl-4 pr-10 w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('contact.form.email')}
                  </label>
                  <div className="relative">
                    <AtSign className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('contact.form.email_placeholder')}
                      className="pl-4 pr-10 w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('contact.form.subject')}
                  </label>
                  <div className="relative">
                    <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('contact.form.subject_placeholder')}
                      className="pl-4 pr-10 w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('contact.form.message')}
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact.form.message_placeholder')}
                    className="min-h-[150px] w-full"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 ml-2" />
                  <span>{t('contact.form.submit')}</span>
                </Button>
              </form>
            </div>
          </AnimatedSection>

          {/* الأسئلة الشائعة */}
          <AnimatedSection>
            <div className="bg-card rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">
                {t('contact.faq.title')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('contact.faq.description')}
              </p>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{t('contact.faq.view_all')}</span>
              </Link>

              <div className="mt-8 pt-8 border-t">
                <h3 className="text-xl font-semibold mb-4">
                  {t('contact.support.title')}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t('contact.support.description')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`tel:${t('contact.support.phone')}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{t('contact.support.call')}</span>
                  </a>
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>{t('contact.support.chat')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
} 