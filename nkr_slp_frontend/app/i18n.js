'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import he from '../messages/he.json';
import en from '../messages/en.json';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: { he: { translation: he }, en: { translation: en } },
    lng: 'he',
    fallbackLng: 'he',
    supportedLngs: ['he', 'en'],
    interpolation: { escapeValue: false },
    initImmediate: false,
  });
}

export default i18n;
