import { Box, Typography } from '@mui/material';
import styles from './ServiceCard.module.css';

export default function ServiceCard({ icon, title, description, href }) {
  return (
    <Box component="a" href={href} className={styles.card}>
      <Box className={styles.icon} aria-hidden="true">{icon}</Box>
      <Typography component="h3" className={styles.title}>{title}</Typography>
      <Typography className={styles.description}>{description}</Typography>
    </Box>
  );
}
