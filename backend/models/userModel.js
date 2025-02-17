const { sql, poolPromise } = require('../config/db');

exports.createUser = async (name, email, hashedPassword) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('Name', sql.VarChar, name)
        .input('Email', sql.VarChar, email)
        .input('Password', sql.VarChar, hashedPassword)
        .execute('sp_InsertUser');

    return result.recordset[0];
};

exports.getUserByEmail = async (email) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('Email', sql.VarChar, email)
        .execute('sp_GetUserByEmail');

    return result.recordset[0];
};
