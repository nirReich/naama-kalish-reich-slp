import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Providers from './providers';
import './globals.css';

export const metadata = {
  title: 'נעמה קליש רייך | קלינאית תקשורת',
  description: 'נעמה קליש רייך, קלינאית תקשורת. מידע על תחומי הטיפול ויצירת קשר.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            {children}
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
