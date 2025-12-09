import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en/translation.json';
import id from '../locales/id/translation.json';
import zh from '../locales/zh/translation.json';
import ja from '../locales/ja/translation.json';
import ko from '../locales/ko/translation.json';
import es from '../locales/es/translation.json';
import fr from '../locales/fr/translation.json';
import de from '../locales/de/translation.json';
import it from '../locales/it/translation.json';
import pt from '../locales/pt/translation.json';
import ru from '../locales/ru/translation.json';
import ar from '../locales/ar/translation.json';
import th from '../locales/th/translation.json';
import vi from '../locales/vi/translation.json';

const resources = {
  en: { translation: en.translation },
  id: { translation: id.translation },
  zh: { translation: zh.translation },
  ja: { translation: ja.translation },
  ko: { translation: ko.translation },
  es: { translation: es.translation },
  fr: { translation: fr.translation },
  de: { translation: de.translation },
  it: { translation: it.translation },
  pt: { translation: pt.translation },
  ru: { translation: ru.translation },
  ar: { translation: ar.translation },
  th: { translation: th.translation },
  vi: { translation: vi.translation }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: import.meta.env.DEV,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    }
  });

export default i18n;
