import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationENG from "./locales/en.json";
import translationVI from "./locales/vi.json";

const resources = {
  en: {
    translation: translationENG,
  },
  vi: {
    translation: translationVI,
  },
};

const language =
  typeof window !== "undefined" && localStorage.getItem("I18N_LANGUAGE");
if (!language && typeof window !== "undefined") {
  localStorage.setItem("I18N_LANGUAGE", "vi");
}

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    lng:
      typeof window !== "undefined"
        ? localStorage.getItem("I18N_LANGUAGE") || "vi"
        : "vi",
    fallbackLng: "vi",

    keySeparator: false,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
