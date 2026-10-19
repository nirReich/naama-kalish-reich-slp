import { Box, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import styles from './SocialLinks.module.css';

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/naamakalishreich_slp_dub/', Icon: InstagramIcon, className: styles.instagram, external: true },
  { label: 'WhatsApp', href: 'https://wa.me/972544281134', Icon: WhatsAppIcon, className: styles.whatsapp, external: true },
  { label: 'Facebook', href: 'https://www.facebook.com/naamaklinait', Icon: FacebookIcon, className: styles.facebook, external: true },
  { label: 'Google', href: 'https://www.google.com/search?q=%D7%A0%D7%A2%D7%9E%D7%94+%D7%A7%D7%9C%D7%99%D7%A9+%D7%A8%D7%99%D7%99%D7%9A', Icon: GoogleIcon, className: styles.google, external: true },
  { label: 'Email', href: 'mailto:kalishn@gmail.com', Icon: EmailOutlinedIcon, className: styles.email },
];

export default function SocialLinks() {
  return (
    <Box component="nav" className={styles.bar} aria-label="Social links">
      {socialLinks.map(({ label, href, Icon, className, external }) => (
        <IconButton
          key={label}
          component="a"
          href={href}
          aria-label={label}
          className={`${styles.link} ${className}`}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          <Icon aria-hidden="true" />
        </IconButton>
      ))}
    </Box>
  );
}
