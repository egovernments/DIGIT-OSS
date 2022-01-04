class System {
    error(message) {
        console.error(`System: ${message}`);
    }
}

module.exports = new System();