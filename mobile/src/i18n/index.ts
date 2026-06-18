import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// We will use expo-localization to detect device language, but for now we set default
// import * as Localization from 'expo-localization';

import en from './en.json';
import sw from './sw.json';
import apd from './apd.json';

const resources = {
  en: { translation: en },
  sw: { translation: sw },
  apd: { translation: apd },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
