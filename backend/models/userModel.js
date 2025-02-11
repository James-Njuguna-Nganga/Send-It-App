const dbHelper = require('../helpers/dbHelper');

exports.getUserByEmail = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await dbHelper.query(sql, [email]);
    return users[0];
};

exports.createUser = async (fullName, email, password) => {
    const sql = 'INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)';
    const result = await dbHelper.query(sql, [fullName, email, password]);
    return { id: result.insertId, fullName, email };
};