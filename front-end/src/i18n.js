import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// import file JSON
import vi from "./locales/vi/translation.json";
import en from "./locales/en/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    en: { translation: en },
  },
  lng: "vi", // ngôn ngữ mặc định
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
