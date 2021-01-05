import i18next from "i18next";
import common_en from "./locales/en/common.json";
import common_ru from "./locales/ru/common.json";

i18next
  .init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: {
      en: {
        common: common_en
      },
      ru: {
        common: common_ru
      },
    },
  });

export default i18next;
