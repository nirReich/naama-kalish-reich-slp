import { Box, Button, Link, Typography } from '@mui/material';
import styles from './HeroSection.module.css';

export default function HeroSection({ t }) {
  return (
    <Box component="section" className={styles.hero} id="home">
      <Box className={styles.copy}>
        <Typography className={styles.eyebrow}><span />{t('hero.eyebrow')}</Typography>
        <Typography component="h1" className={styles.title}>{t('hero.title')}<br /><em>{t('hero.titleAccent')}</em></Typography>
        <Typography className={styles.text}>{t('hero.description')}</Typography>
        <Box className={styles.actions}>
          <Button component="a" href="#contact" className={`${styles.button} ${styles.darkButton}`}>{t('hero.primary')} <span aria-hidden="true">←</span></Button>
          <Link href="#services" className={styles.textLink}>{t('hero.secondary')} <span aria-hidden="true">↓</span></Link>
        </Box>
        <Box className={styles.note}><span className={styles.noteMark}>נ׳</span><span>{t('brand')}<br /><small>{t('profession')}</small></span></Box>
      </Box>
      <Box className={styles.visual}>
        <Box className={styles.portrait}><img src="/assets/naama-portrait.png" alt={t('hero.portraitAlt')} /></Box>
        <Box className={styles.stamp}><span>{t('hero.stampTop')}</span><span className={styles.stampStar}>✳</span><span>{t('hero.stampBottom')}</span></Box>
        <Box className={styles.caption}>{t('hero.captionLine1')}<br />{t('hero.captionLine2')}</Box>
      </Box>
      <Typography className={styles.number}>01 <span>—</span> 04</Typography>
    </Box>
  );
}
