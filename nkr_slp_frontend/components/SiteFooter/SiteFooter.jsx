import { Box, Link } from '@mui/material';
import styles from './SiteFooter.module.css';

export default function SiteFooter({ t }) {
  return <Box component="footer" className={styles.footer}><span>© {t('brand')}</span><span>{t('profession')}</span><Link href="#home" aria-label={t('backToTop')}>NKR</Link></Box>;
}
