const { sql, poolPromise } = require('../config/db');
const { sendParcelStatusSMS } = require('../services/sms/sendSms');

// Create Parcel
const createParcel = async (req, res) => {
    try {
        const { pickupLocation, destination, receiverEmail, receiverPhone } = req.body;
        const userId = req.user.id;

        if (!pickupLocation || !destination || !receiverEmail || !receiverPhone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .input('PickupLocation', sql.VarChar(255), pickupLocation)
            .input('Destination', sql.VarChar(255), destination)
            .input('ReceiverEmail', sql.VarChar(255), receiverEmail)
            .input('ReceiverPhone', sql.VarChar(20), receiverPhone)
            .execute('sp_InsertOrUpdateParcel');

        // Send SMS notification to receiver
        try {
            await sendParcelStatusSMS(
                receiverPhone,
                result.recordset[0].ParcelID,
                'Created'
            );
        } catch (smsError) {
            console.error('SMS notification failed:', smsError);
        }

        res.status(201).json({
            success: true,
            message: 'Parcel created successfully',
            parcelId: result.recordset[0].ParcelID
        });
    } catch (error) {
        console.error('Create parcel error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating parcel',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get All Parcels (Admin Only)
const getAllParcels = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .execute('sp_GetAllParcels');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (error) {
        console.error('Get all parcels error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching parcels',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get User's Parcels
const getUserParcels = async (req, res) => {
    try {
        const userId = req.user.id;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .execute('sp_GetUserParcels');

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (error) {
        console.error('Get user parcels error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user parcels',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get Parcel By ID
const getParcelById = async (req, res) => {
    try {
        const parcelId = req.params.id;
        
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ParcelID', sql.Int, parcelId)
            .execute('sp_GetParcelById');

        if (!result.recordset[0]) {
            return res.status(404).json({
                success: false,
                message: 'Parcel not found'
            });
        }

        res.json({
            success: true,
            data: result.recordset[0]
        });
    } catch (error) {
        console.error('Get parcel error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching parcel details',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update Parcel Details
const updateParcel = async (req, res) => {
    try {
        const { parcelId } = req.params;
        const { pickupLocation, destination, receiverEmail, receiverPhone } = req.body;
        const userId = req.user.id;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('ParcelID', sql.Int, parcelId)
            .input('UserID', sql.Int, userId)
            .input('PickupLocation', sql.VarChar(255), pickupLocation)
            .input('Destination', sql.VarChar(255), destination)
            .input('ReceiverEmail', sql.VarChar(255), receiverEmail)
            .input('ReceiverPhone', sql.VarChar(20), receiverPhone)
            .execute('sp_UpdateParcel');

        if (!result.recordset[0]) {
            return res.status(404).json({
                success: false,
                message: 'Parcel not found or unauthorized'
            });
        }

        // Send SMS notification for update
        if (receiverPhone) {
            try {
                await sendParcelStatusSMS(
                    receiverPhone,
                    parcelId,
                    'Updated'
                );
            } catch (smsError) {
                console.error('SMS notification failed:', smsError);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Parcel updated successfully',
            data: result.recordset[0]
        });
    } catch (error) {
        console.error('Update parcel error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating parcel',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update Parcel Status (Admin Only)
const updateParcelStatus = async (req, res) => {
    try {
        const { parcelId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Please provide status'
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('ParcelID', sql.Int, parcelId)
            .input('Status', sql.VarChar(50), status)
            .execute('sp_UpdateParcelStatus');

        if (result.recordset[0]) {
            // Send SMS notification for status update
            try {
                await sendParcelStatusSMS(
                    result.recordset[0].ReceiverPhone,
                    parcelId,
                    status
                );
            } catch (smsError) {
                console.error('SMS notification failed:', smsError);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Parcel status updated successfully',
            data: result.recordset[0]
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating parcel status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Soft Delete Parcel
const softDeleteParcel = async (req, res) => {
    try {
        const { parcelId } = req.params;
        const userId = req.user.id;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('ParcelID', sql.Int, parcelId)
            .input('UserID', sql.Int, userId)
            .execute('sp_SoftDeleteParcel');

        // Send SMS notification for deletion
        if (result.recordset[0]) {
            try {
                await sendParcelStatusSMS(
                    result.recordset[0].ReceiverPhone,
                    parcelId,
                    'Cancelled'
                );
            } catch (smsError) {
                console.error('SMS notification failed:', smsError);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Parcel deleted successfully'
        });
    } catch (error) {
        console.error('Delete parcel error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting parcel',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    createParcel,
    getAllParcels,
    getUserParcels,
    getParcelById,
    updateParcel,
    updateParcelStatus,
    softDeleteParcel
};