const config = require('../env-variables');
const consoleProvider = require('./console');
const gupShupWhatsAppProvider = require('./gupshup');
const valueFirstWhatsAppProvider = require('./value-first');

if(config.whatsAppProvider == 'GupShup') {
    console.log('Using GupShup as the channel')
    module.exports = gupShupWhatsAppProvider;
} else if(config.whatsAppProvider == 'ValueFirst') {
    console.log('Using ValueFirst as the channel')
    module.exports = valueFirstWhatsAppProvider;
} else {
    console.log('Using console as the output channel');
    module.exports = consoleProvider;
}
