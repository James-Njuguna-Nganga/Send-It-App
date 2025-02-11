const dbHelper = require('../helpers/dbHelper');

exports.createParcel = async (userId, pickupLocation, destination, receiverEmail) => {
    const sql = 'INSERT INTO parcels (userId, pickupLocation, destination, receiverEmail) VALUES (?, ?, ?, ?)';
    const result = await dbHelper.query(sql, [userId, pickupLocation, destination, receiverEmail]);
    return { id: result.insertId, userId, pickupLocation, destination, receiverEmail };
};

exports.updateParcelStatus = async (parcelId, status) => {
    const sql = 'UPDATE parcels SET status = ? WHERE id = ?';
    await dbHelper.query(sql, [status, parcelId]);
    const updatedParcel = await this.getParcelById(parcelId);
    return updatedParcel;
};

exports.getParcelsByUser = async (userId) => {
    const sql = 'SELECT * FROM parcels WHERE userId = ?';
    return await dbHelper.query(sql, [userId]);
};

exports.getParcelById = async (parcelId) => {
    const sql = 'SELECT * FROM parcels WHERE id = ?';
    const parcels = await dbHelper.query(sql, [parcelId]);
    return parcels[0];
};