'use client';

import { useState } from 'react';
import { AppBar, Box, Button, IconButton, Link, Toolbar } from '@mui/material';
import styles from './Header.module.css';

export default function Header({ language, onLanguageChange, t }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const isHebrew = language === 'he';

  return (
    <AppBar position="static" elevation={0} color="transparent" className={styles.header}>
      <Toolbar className={styles.inner}>
        <Link href="#home" className={styles.brand} aria-label={t('brand')} onClick={closeMenu}>
          <img src="/assets/nkr-logo.jpg" alt={t('brand')} />
        </Link>
        <IconButton className={styles.menuToggle} onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? t('closeMenu') : t('openMenu')} aria-expanded={menuOpen}>
          {menuOpen ? '×' : '☰'}
        </IconButton>
        <Box component="nav" className={`${styles.nav} ${menuOpen ? styles.open : ''}`} aria-label={t('mainNavigation')}>
          <Link href="#about" onClick={closeMenu}>{t('nav.about')}</Link>
          <Link href="#services" onClick={closeMenu}>{t('nav.services')}</Link>
          <Link href="#approach" onClick={closeMenu}>{t('nav.approach')}</Link>
          <Link href="#contact" className={styles.cta} onClick={closeMenu}>{t('nav.contact')}</Link>
        </Box>
        <Button className={styles.languageButton} onClick={() => onLanguageChange(isHebrew ? 'en' : 'he')}>{isHebrew ? 'EN' : 'עב'}</Button>
      </Toolbar>
    </AppBar>
  );
}
