import { Box, Container, Typography } from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceGrinTongue } from '@fortawesome/free-regular-svg-icons';
import SectionKicker from '../SectionKicker/SectionKicker';
import ServiceCard from '../ServiceCard/ServiceCard';
import styles from './ServicesSection.module.css';

const services = [
  { id: 'language', icon: <QuestionAnswerIcon /> },
  { id: 'speech', icon: <RecordVoiceOverIcon /> },
  { id: 'voice', icon: <GraphicEqIcon /> },
  { id: 'oral', icon: <FontAwesomeIcon icon={faFaceGrinTongue} /> },
];

export default function ServicesSection({ t }) {
  return <Box component="section" className={styles.section} id="services"><Container maxWidth={false} disableGutters>
    <SectionKicker number="02" label={t('sections.services')} />
    <Box className={styles.heading}><Typography component="h2" className={styles.title}>{t('services.title1')}<br /><em>{t('services.titleAccent')}</em></Typography><Typography className={styles.intro}>{t('services.description')}</Typography></Box>
    <Box className={styles.grid}>{services.map((service) => <ServiceCard key={service.id} icon={service.icon} title={t(`services.${service.id}.title`)} description={t(`services.${service.id}.description`)} href="#contact" />)}</Box>
    <Typography className={styles.footnote}>{t('services.note')}</Typography>
  </Container></Box>;
}
