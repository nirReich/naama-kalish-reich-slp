import { Box, Button, Typography } from '@mui/material';
import SectionKicker from '../SectionKicker/SectionKicker';
import styles from './ApproachSection.module.css';

export default function ApproachSection({ t }) {
  return <Box component="section" className={styles.section} id="approach">
    <Box className={styles.photo}><img src="/assets/therapy-session.png" alt={t('approach.photoAlt')} /></Box>
    <Box className={styles.copy}><SectionKicker number="03" label={t('sections.approach')} light />
      <Typography component="h2" className={styles.title}>{t('approach.title1')}<br />{t('approach.title2')}<br /><em>{t('approach.titleAccent')}</em></Typography>
      <Typography className={styles.description}>{t('approach.description')}</Typography>
      <Button component="a" href="#contact" className={styles.button}>{t('approach.button')} <span>←</span></Button>
      <span className={styles.deco} aria-hidden="true">נ</span>
    </Box>
  </Box>;
}
