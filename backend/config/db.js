const sql = require('mssql');
const dotenv = require('dotenv');
const { log } = require('console');

// Load environment variables using CommonJS

const path = require('path');

// Load the .env file from a specific path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });


const config = {
    user: process.env.DB_USER || 'your_default_user',
    password: process.env.DB_PASSWORD || 'your_default_password',
    server: process.env.DB_SERVER || 'your_default_server',
    database: process.env.DB_NAME || 'your_default_db',
    options: {
        encrypt: true, // Use encryption
        enableArithAbort: true,
        trustServerCertificate: true// Fix SSL issues
    }
};
async function testConnection() {
    //test whether we can query the database
    try {
        // const pool = await poolPromise;
        let pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Test');
        console.log(result.recordset);
        return result;
    } catch (error) {
        console.error('Error testing database connection', error);
        return error;
    }
}
console.log('should see')
console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_NAME)
testConnection();

// Ensure required environment variables are loaded
if (!config.server || typeof config.server !== 'string') {
    throw new Error('Database connection failed: The "config.server" property is required and must be of type string.');
}

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed!', err);
        process.exit(1); // Stop the server if DB connection fails
    });

module.exports = {
    sql, poolPromise
};
