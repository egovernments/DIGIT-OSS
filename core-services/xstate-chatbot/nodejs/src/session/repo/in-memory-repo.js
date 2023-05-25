class StateRepository {

    constructor() {
        this.states = {};
    }

    async insertNewState(userId, active, state) {
        this.states[userId] = state;
    }

    async updateState(userId, active, state) {
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

}

module.exports = new StateRepository();