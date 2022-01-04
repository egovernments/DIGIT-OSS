const config = require('../../env-variables'),
    fetch = require('node-fetch');

class LocalisationService {

    async init() {
        this.messages = {}
        this.supportedLocales = config.supportedLocales.split(',');
        for(let i = 0; i < this.supportedLocales.length; i++) {
            this.supportedLocales[i] = this.supportedLocales[i].trim();
        }
        this.supportedLocales.forEach(async (locale, index) => {
            let codeToMessages = {};
            let messages = await this.fetchMessagesForLocale(locale, config.rootTenantId);
            messages.forEach((record, index) => {
                const code =  record['code'];
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
        var messageBundle = {};
        for(var locale in this.messages) {
            messageBundle[locale] = this.messages[locale][code];
        }
        return messageBundle;
    }

    async getMessagesForCodesAndTenantId(codes, tenantId) {
        let messageBundle = {};
        for(let code of codes) {
            messageBundle[code] = {}
        }
        for(let locale of this.supportedLocales) {
            let codeToMessages = {};
            let messages = await this.fetchMessagesForLocale(locale, tenantId);
            messages.forEach((record, index) => {
                const code =  record['code'];
                const message = record['message'];
                codeToMessages[code] = message;
            });
            for(let code of codes) {
                messageBundle[code][locale] = codeToMessages[code];
            }
        }
        return messageBundle;
    }

    async fetchMessagesForLocale(locale, tenantId) {
        var url = config.egovServices.egovServicesHost + config.egovServices.localisationServiceSearchPath + '?tenantId=' + tenantId + '&locale=' + locale;
        var options = {
            method: 'POST'
        }
        const response = await fetch(url, options);
        const data = await response.json();
        return data['messages'];
    }

}

const localisationService = new LocalisationService();
localisationService.init();

module.exports = localisationService;