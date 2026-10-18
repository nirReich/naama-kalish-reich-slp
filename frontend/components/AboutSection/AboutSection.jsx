import { Box, Container, Link, Typography } from '@mui/material';
import SectionKicker from '../SectionKicker/SectionKicker';
import styles from './AboutSection.module.css';

export default function AboutSection({ t }) {
  return <Box component="section" className={styles.section} id="about"><Container maxWidth={false} disableGutters>
    <SectionKicker number="01" label={t('sections.about')} />
    <Box className={styles.grid}>
      <Typography component="h2" className={styles.title}>{t('about.title1')}<br />{t('about.title2')}<br /><em>{t('about.titleAccent')}</em></Typography>
      <Box className={styles.copy}><Typography className={styles.lead}>{t('about.lead')}</Typography><Typography>{t('about.description')}</Typography><Link href="#contact" className={styles.link}>{t('about.link')} <span>←</span></Link></Box>
    </Box>
  </Container></Box>;
}
