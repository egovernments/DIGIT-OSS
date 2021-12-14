const pool = require('./postgres-config');

class StateRepository {

    async insertNewState(userId, active, state, session_id, time_stamp) {
        const query = 'INSERT INTO eg_chat_state_v2 (user_id, active, state, session_id, time_stamp) VALUES ($1, $2, $3, $4, $5)';
        let result = await pool.query(query, [userId, active, state, session_id, time_stamp]);
        return result;
    }

    async updateState(userId, active, state, time_stamp) {
        const query = 'UPDATE eg_chat_state_v2 SET active = $2, state = $3, time_stamp = $4 WHERE user_id = $1';
        let result = await pool.query(query, [userId, active, state, time_stamp]);
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

    async updateSessionId(userId, sessionTime) {
        const query = 'UPDATE eg_chat_state_v2 as chat SET session_id = md5(random()::text || clock_timestamp()::text)::uuid, time_stamp = round(EXTRACT (EPOCH FROM now())::float*1000) WHERE user_id = $1 AND ((round(EXTRACT (EPOCH FROM now())::float*1000) - chat.time_stamp)/1000/60) > $2';
        let result = await pool.query(query, [userId, sessionTime]);
        return result;
    }

    async getSessionId(userId) {
        const query = 'SELECT session_id FROM eg_chat_state_v2 WHERE user_id = $1 AND active = true';
        let result = await pool.query(query, [userId]);
        if(result.rowCount >= 1) {
            let session_id = result.rows[0].session_id;
            return session_id;
        }
    }

}

module.exports = new StateRepository();