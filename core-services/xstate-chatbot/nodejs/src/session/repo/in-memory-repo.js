const uuid = require('uuid');

class StateRepository {

    constructor() {
        this.states = {};
    }

    async insertNewState(userId, active, state, session_id, time_stamp) {
        this.states[userId] = state;
    }

    async updateState(userId, active, state, time_stamp) {
        this.states[userId] = state;
    }

    async getActiveStateForUserId(userId) {
        if(this.states[userId]) {
            let state = JSON.parse(this.states[userId]);
            if(!state.done) {
                return state;
            }
        }
    }

    async updateSessionId(userId, sessionTime) {
        return;
    }

    async getSessionId(userId) {
        if(this.states[userId]) {
            let state = JSON.parse(this.states[userId]);
            if(!state.done) {
                return uuid.v4();
            }
        }
    }

}

module.exports = new StateRepository();