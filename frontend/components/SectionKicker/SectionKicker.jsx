import { Box } from '@mui/material';
import styles from './SectionKicker.module.css';

export default function SectionKicker({ number, label, light = false }) {
  return <Box className={`${styles.kicker} ${light ? styles.light : ''}`}><span>{number}</span><span className={styles.line} /><span>{label}</span></Box>;
}
