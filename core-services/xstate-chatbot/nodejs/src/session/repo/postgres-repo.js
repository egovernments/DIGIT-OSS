const pool = require('./postgres-config');

class StateRepository {

    async insertNewState(userId, active, state) {
        const query = 'INSERT INTO eg_chat_state_v2 (user_id, active, state) VALUES ($1, $2, $3)';
        let result = await pool.query(query, [userId, active, state]);
        return result;
    }

    async updateState(userId, active, state) {
        const query = 'UPDATE eg_chat_state_v2 SET active = $2, state = $3 WHERE user_id = $1';
        let result = await pool.query(query, [userId, active, state]);
        return result;
    }

    async getActiveStateForUserId(userId) {
        const query = 'SELECT (state) FROM eg_chat_state_v2 WHERE user_id = $1 AND active = true';
        let result = await pool.query(query, [userId]);
        if(result.rowCount >= 1) {
            let state = result.rows[0].state;
            return state;
        }
    }

    async getUserId(active){
        const query = 'SELECT DISTINCT user_id FROM eg_chat_state_v2 WHERE active = $1';
        let result = await pool.query(query, [active]);
        let userIdList = [];
        if(result.rowCount >= 1) {
            for(let row of result.rows){
                userIdList.push(row.user_id)
            }
        }
        return userIdList;
    }

}

module.exports = new StateRepository();