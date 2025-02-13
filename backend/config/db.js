const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '2024',
    server: process.env.DB_SERVER || 'SAMWEL-GRAYHAT2',
    database: process.env.DB_NAME || 'SenditApp',
    options: {
        encrypt: false, // Change this to false for local SQL Server
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Create connection pool
const pool = new sql.ConnectionPool(config);

// Connect and create a global promise
const poolPromise = pool.connect()
    .then(pool => {
        console.log('Connected to SQL Server successfully');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed:', err);
        throw err;
    });

const testConnection = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT 1');
        console.log('Database connection test successful');
        return true;
    } catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    }
};

module.exports = {
    sql,
    poolPromise,
    testConnection
};