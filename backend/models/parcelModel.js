const { sql, poolPromise } = require('../config/db');

exports.createParcel = async (userId, pickupLocation, destination, receiverEmail) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .input('PickupLocation', sql.VarChar, pickupLocation)
        .input('Destination', sql.VarChar, destination)
        .input('ReceiverEmail', sql.VarChar, receiverEmail)
        .execute('sp_InsertOrUpdateParcel');

    return result.recordset[0];
};

exports.softDeleteParcel = async (parcelId) => {
    const pool = await poolPromise;
    await pool.request()
        .input('ParcelID', sql.Int, parcelId)
        .execute('sp_SoftDeleteParcel');
};
