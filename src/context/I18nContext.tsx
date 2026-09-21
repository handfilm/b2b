import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { LanguageCode } from '../types';
import { TRANSLATIONS, getTranslation, toBengaliDigits, TranslationKey } from '../i18n/translations';

interface I18nContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  toggleLang: () => void;
  t: typeof TRANSLATIONS.EN;
  toDigits: (val: string | number) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('made_in_bd_lang');
      if (saved === 'BN' || saved === 'EN') return saved;
    } catch {
      // ignore
    }
    return 'EN';
  });

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang);
    try {
      localStorage.setItem('made_in_bd_lang', newLang);
      document.documentElement.lang = newLang.toLowerCase();
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === 'EN' ? 'BN' : 'EN');
  };

  useEffect(() => {
    try {
      document.documentElement.lang = lang.toLowerCase();
    } catch {
      // ignore
    }
  }, [lang]);

  const t = useMemo(() => getTranslation(lang), [lang]);
  const toDigits = useMemo(() => (val: string | number) => toBengaliDigits(val, lang), [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t,
      toDigits,
    }),
    [lang, t, toDigits]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      lang: 'EN',
      setLang: () => {},
      toggleLang: () => {},
      t: TRANSLATIONS.EN,
      toDigits: (v) => String(v),
    };
  }
  return context;
};
