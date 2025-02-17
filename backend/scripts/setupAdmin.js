const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../config/db');

const setupAdmin = async () => {
    try {
        const pool = await poolPromise;
        const adminData = {
            email: 'admin@sendit.com',
            password: 'admin123',
            name: 'Admin User'
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);
        await pool.request()
            .input('Email', sql.NVarChar(255), adminData.email)
            .query('DELETE FROM Usertable WHERE Email = @Email');
        await pool.request()
            .input('Name', sql.NVarChar(255), adminData.name)
            .input('Email', sql.NVarChar(255), adminData.email)
            .input('Password', sql.NVarChar(255), hashedPassword)
            .input('Role', sql.NVarChar(50), 'admin')
            .query(`
                INSERT INTO Usertable (Name, Email, Password, Role)
                VALUES (@Name, @Email, @Password, @Role)
            `);

        console.log('\nAdmin setup completed successfully!');
        console.log('Login credentials:');
        console.log('Email:', adminData.email);
        console.log('Password:', adminData.password);

    } catch (error) {
        console.error('Error setting up admin:', error);
    } finally {
        process.exit();
    }
};

setupAdmin();