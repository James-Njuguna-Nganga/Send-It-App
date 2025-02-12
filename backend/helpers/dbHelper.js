const { sql, poolPromise } = require('../config/db');

exports.executeStoredProcedure = async (procedureName, params) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();
        params.forEach(param => {
            request.input(param.name, param.type, param.value);
        });
        const result = await request.execute(procedureName);
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
};