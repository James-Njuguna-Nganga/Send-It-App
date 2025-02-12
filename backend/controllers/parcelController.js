exports.createParcel = async (req, res) => {
    try {
        const { userId, pickupLocation, destination, receiverEmail } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .input('PickupLocation', sql.VarChar, pickupLocation)
            .input('Destination', sql.VarChar, destination)
            .input('ReceiverEmail', sql.VarChar, receiverEmail)
            .execute('sp_InsertOrUpdateParcel');

        res.status(201).json({ message: 'Parcel created successfully', parcelId: result.recordset[0].ParcelID });
    } catch (error) {
        res.status(500).json({ message: 'Error creating parcel', error: error.message });
    }
};

exports.softDeleteParcel = async (req, res) => {
    try {
        const { parcelId } = req.params;
        const pool = await poolPromise;
        await pool.request()
            .input('ParcelID', sql.Int, parcelId)
            .execute('sp_SoftDeleteParcel');

        res.json({ message: 'Parcel deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting parcel', error: error.message });
    }
};
