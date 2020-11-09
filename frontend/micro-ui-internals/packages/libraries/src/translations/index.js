import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import ReactPostprocessor from "i18next-react-postprocessor";

const i18nextConfig = {
  lng: "en",
  fallbackLng: "en",
  debug: false,
  ns: ["translations"],
  defaultNS: "translations",
  keySeparator: false,
  saveMissing: false,
  saveMissingTo: "current",
  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },
  postProcess: [`reactPostprocessor`],
  react: {
    wait: true,
    useSuspense: true,
    bindI18n: "loaded",
    bindI18nStore: "added",
  },
  resources: {
    en: {
      translation: {
        welcome: "Welcome",
      },
    },
  },
};

export const initI18n = () => {
  i18next.use(new ReactPostprocessor()).use(initReactI18next).init(i18nextConfig);
};
