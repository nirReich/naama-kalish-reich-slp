import { Box, Link } from '@mui/material';
import SocialLinks from '../SocialLinks/SocialLinks';
import styles from './SiteFooter.module.css';

export default function SiteFooter({ t }) {
  return (
    <Box component="footer" className={styles.footer}>
      <div className={styles.details}>
        <span>© {t('brand')}</span>
        <span>{t('profession')}</span>
      </div>
      <SocialLinks />
      <Link href="#home" aria-label={t('backToTop')} className={styles.homeLink}>NKR</Link>
    </Box>
  );
}
