const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const config = {
    user: process.env.DB_USER || 'your_default_user',
    password: process.env.DB_PASSWORD || 'your_default_password',
    server: process.env.DB_SERVER || 'your_default_server',
    database: process.env.DB_NAME || 'your_default_db',
    // options: {
    //     encrypt: false, // Use encryption
    //     enableArithAbort: true,
    //     trustServerCertificate: false // Fix SSL issues
    // }
};

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
