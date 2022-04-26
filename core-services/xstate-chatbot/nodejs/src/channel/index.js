const config = require('../env-variables');
const consoleProvider = require('./console');
const gupShupWhatsAppProvider = require('./gupshup');
const valueFirstWhatsAppProvider = require('./value-first');

if(config.whatsAppProvider == 'GupShup') {
    module.exports = gupShupWhatsAppProvider;
} else if(config.whatsAppProvider == 'ValueFirst') {
    module.exports = valueFirstWhatsAppProvider;
} else if(config.whatsAppProvider == 'Kaleyra') {
    module.exports = require('./kaleyra');
} else {
    module.exports = consoleProvider;
}
