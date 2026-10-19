import { Box, Container, Link, Typography } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SectionKicker from '../SectionKicker/SectionKicker';
import styles from './ContactSection.module.css';

export default function ContactSection({ t }) {
  return <Box component="section" className={styles.section} id="contact"><Container maxWidth={false} disableGutters>
    <SectionKicker number="04" label={t('sections.contact')} />
    <Box className={styles.grid}><Box>
      <Typography component="h2" className={styles.title}>{t('contact.title1')}<br />{t('contact.title2')}<br /><em>{t('contact.titleAccent')}</em></Typography>
      <Typography className={styles.lead}>{t('contact.description')}</Typography>
    </Box><Box className={styles.details}>
      <Typography className={`${styles.label} ${styles.iconLabel}`}><PhoneOutlinedIcon className={styles.detailIcon} aria-hidden="true" />{t('contact.phoneLabel')}</Typography>
      <Link className={styles.phone} href="tel:+972502255125">050-225-5125</Link>
      <Typography className={`${styles.label} ${styles.addressLabel} ${styles.iconLabel}`}><LocationOnOutlinedIcon className={styles.detailIcon} aria-hidden="true" />{t('contact.locationLabel')}</Typography>
      <Typography className={styles.address}>{t('contact.address1')}<br />{t('contact.address2')}</Typography>
      <Link className={styles.map} href="https://maps.google.com/?q=רחוב+טירת+צבי+8+תל+אביב" target="_blank" rel="noreferrer">{t('contact.map')}</Link>
    </Box></Box>
  </Container></Box>;
}
