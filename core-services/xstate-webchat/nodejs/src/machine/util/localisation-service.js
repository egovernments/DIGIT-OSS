const fetch = require('node-fetch');
const config = require('../../env-variables');

class LocalisationService {
  async init() {
    this.messages = {};
    this.supportedLocales = config.supportedLocales.split(',');
    for (let i = 0; i < this.supportedLocales.length; i++) {
      this.supportedLocales[i] = this.supportedLocales[i].trim();
    }
    this.supportedLocales.forEach(async (locale, index) => {
      const codeToMessages = {};
      const messages = await this.fetchMessagesForLocale(locale, config.rootTenantId);
      messages.forEach((record, index) => {
        const code = record['code'];
        const message = record['message'];
        codeToMessages[code] = message;
      });
      this.messages[locale] = codeToMessages;
    });
  }

  getMessageForCode(code, locale) {
    return this.messages[locale][code];
  }

  getMessageBundleForCode(code) {
    const messageBundle = {};
    for (const locale in this.messages) {
      messageBundle[locale] = this.messages[locale][code];
    }
    return messageBundle;
  }

  async getMessagesForCodesAndTenantId(codes, tenantId) {
    const messageBundle = {};
    for (const code of codes) {
      messageBundle[code] = {};
    }
    for (const locale of this.supportedLocales) {
      const codeToMessages = {};
      const messages = await this.fetchMessagesForLocale(locale, tenantId);
      messages.forEach((record, index) => {
        const code = record['code'];
        const message = record['message'];
        codeToMessages[code] = message;
      });
      for (const code of codes) {
        messageBundle[code][locale] = codeToMessages[code];
      }
    }
    return messageBundle;
  }

  async fetchMessagesForLocale(locale, tenantId) {
    const url = `${config.egovServices.egovServicesHost + config.egovServices.localisationServiceSearchPath}?tenantId=${tenantId}&locale=${locale}`;
    const options = {
      method: 'POST',
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return data['messages'];
  }
}

const localisationService = new LocalisationService();
localisationService.init();

module.exports = localisationService;
