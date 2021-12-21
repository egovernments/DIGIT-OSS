const config = require('../env-variables');
const consoleProvider = require('./console');
const webProvider = require('./web');

if(config.whatsAppProvider == 'web') {
    console.log('Using web as the channel');
    module.exports = webProvider;
} else {
    console.log('Using console as the output channel');
    module.exports = consoleProvider;
}
