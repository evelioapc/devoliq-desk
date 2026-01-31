import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from '../locales/es.json';
import pt from '../locales/pt.json';
import en from '../locales/en.json';

const resources = {
  es: { translation: es },
  pt: { translation: pt },
  en: { translation: en },
};

export function initI18n(locale = 'es') {
  const lng = ['es', 'pt', 'en'].includes(locale) ? locale : 'es';
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng,
      fallbackLng: 'es',
      interpolation: {
        escapeValue: false, // React already escapes
      },
    });
  return i18n;
}

export default i18n;
