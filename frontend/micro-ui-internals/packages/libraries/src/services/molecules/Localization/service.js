import Urls from "../../atoms/urls";
import { Storage } from "../../atoms/Utils/Storage";
import i18next from "i18next";
import { Request } from "../../atoms/Utils/Request";

const LOCALE_LIST = (locale) => `Locale.${locale}.List`;
const LOCALE_MODULE = (locale, module) => `Locale.${locale}.${module}`;

const TransformArrayToObj = (traslationList) => {
  return traslationList.reduce(
    // eslint-disable-next-line
    (obj, item) => ((obj[item.code] = item.message), obj),
    {}
  );
  // return trasformedTraslation;
};

const LocalizationStore = {
  getList: (locale) => Storage.get(LOCALE_LIST(locale)) || [],
  store: (locale, modules, messages) => {
    modules.forEach((module) => {
      const Locales = LocalizationStore.getList(locale);
      if (!Locales.includes(module)) {
        Locales.push(module);
        Storage.set(LOCALE_LIST(locale), Locales);
        const moduleMessages = messages.filter((message) => message.module === module);
        Storage.set(LOCALE_MODULE(locale, module), moduleMessages);
      }
    });
  },
  get: (locale, modules) => {
    const storedModules = LocalizationStore.getList(locale);
    const newModules = modules.filter((module) => !storedModules.includes(module));
    const messages = [];
    storedModules.forEach((module) => {
      messages.push(...Storage.get(LOCALE_MODULE(locale, module)));
    });
    return [newModules, messages];
  },

  updateResources: (locale, messages) => {
    let locales = TransformArrayToObj(messages);
    i18next.addResources(locale, "translations", locales);
  },
};

export const LocalizationService = {
  getLocale: async ({ modules = [], locale = "en_IN", tenantId }) => {
    if (locale.indexOf("_IN") === -1) {
      locale += "_IN";
    }
    const [newModules, messages] = LocalizationStore.get(locale, modules);
    if (newModules.length > 0) {
      const data = await Request({ url: Urls.localization, params: { module: newModules.join(","), locale, tenantId }, useCache: false });
      messages.push(...data.messages);
    }
    LocalizationStore.store(locale, modules, messages);
    LocalizationStore.updateResources(locale, messages);
    return messages;
  },
  updateResources: (locale = "en_IN", messages) => {
    if (locale.indexOf("_IN") === -1) {
      locale += "_IN";
    }
    LocalizationStore.updateResources(locale, messages);
  },
};
