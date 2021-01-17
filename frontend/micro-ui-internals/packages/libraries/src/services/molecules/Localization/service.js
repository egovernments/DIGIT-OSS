import Urls from "../../atoms/urls";
import { Storage } from "../../atoms/Utils/Storage";
import i18next from "i18next";
import { Request } from "../../atoms/Utils/Request";

const LOCALE_LIST = (locale) => `Locale.${locale}.List`;
const LOCALE_ALL_LIST = () => `Locale.List`;
const LOCALE_MODULE = (locale, module) => `Locale.${locale}.${module}`;

const TransformArrayToObj = (traslationList) => {
  return traslationList.reduce(
    // eslint-disable-next-line
    (obj, item) => ((obj[item.code] = item.message), obj),
    {}
  );
  // return trasformedTraslation;
};

const getUnique = (arr) => {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
};

const LocalizationStore = {
  getList: (locale) => Storage.get(LOCALE_LIST(locale)) || [],
  setList: (locale, namespaces) => Storage.set(LOCALE_LIST(locale), namespaces),
  getAllList: () => Storage.get(LOCALE_ALL_LIST()) || [],
  setAllList: (namespaces) => Storage.set(LOCALE_ALL_LIST(), namespaces),
  store: (locale, modules, messages) => {
    const AllNamespaces = LocalizationStore.getAllList();
    const Namespaces = LocalizationStore.getList(locale);
    modules.forEach((module) => {
      if (!Namespaces.includes(module)) {
        Namespaces.push(module);
        const moduleMessages = messages.filter((message) => message.module === module);
        Storage.set(LOCALE_MODULE(locale, module), moduleMessages);
      }
    });
    Storage.set(LOCALE_LIST(locale), Namespaces);
    LocalizationStore.setAllList(getUnique([...AllNamespaces, ...Namespaces]));
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
      setTimeout(() => LocalizationStore.store(locale, newModules, data.messages), 100);
    }
    LocalizationStore.updateResources(locale, messages);
    return messages;
  },
  changeLanguage: (locale, tenantId) => {
    const modules = LocalizationStore.getList(locale);
    const allModules = LocalizationStore.getAllList();
    const uniqueModules = allModules.filter((module) => !modules.includes(module));
    LocalizationService.getLocale({ modules: uniqueModules, locale, tenantId });
    i18next.changeLanguage(locale);
  },
  updateResources: (locale = "en_IN", messages) => {
    if (locale.indexOf("_IN") === -1) {
      locale += "_IN";
    }
    LocalizationStore.updateResources(locale, messages);
  },
};
