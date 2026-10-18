'use client';

import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './i18n';
import Header from '../components/Header/Header';
import HeroSection from '../components/HeroSection/HeroSection';
import AboutSection from '../components/AboutSection/AboutSection';
import ServicesSection from '../components/ServicesSection/ServicesSection';
import ApproachSection from '../components/ApproachSection/ApproachSection';
import ContactSection from '../components/ContactSection/ContactSection';
import SiteFooter from '../components/SiteFooter/SiteFooter';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('he');

  useEffect(() => {
    const saved = window.localStorage.getItem('site-language');
    if (saved === 'he' || saved === 'en') {
      setLanguage(saved);
      i18n.changeLanguage(saved);
    }
  }, [i18n]);

  const isHebrew = language === 'he';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isHebrew ? 'rtl' : 'ltr';
  }, [language, isHebrew]);

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem('site-language', nextLanguage);
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <Box className={isHebrew ? 'site rtl' : 'site ltr'}>
      <Header language={language} onLanguageChange={changeLanguage} t={t} />
      <Box component="main">
        <HeroSection t={t} />
        <AboutSection t={t} />
        <ServicesSection t={t} />
        <ApproachSection t={t} />
        <ContactSection t={t} />
      </Box>
      <SiteFooter t={t} />
    </Box>
  );
}
