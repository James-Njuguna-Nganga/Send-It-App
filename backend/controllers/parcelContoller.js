const { getParcelsByUser, createParcel, updateParcelStatus } = require('../models/parcelModel');
const { sendStatusUpdateEmail } = require('../services/emailService');

exports.createParcel = async (req, res) => {
    const { userId, pickupLocation, destination, receiverEmail } = req.body;
    const parcel = await createParcel(userId, pickupLocation, destination, receiverEmail);
    res.status(201).json(parcel);
};

exports.updateParcelStatus = async (req, res) => {
    const { parcelId, status } = req.body;
    const parcel = await updateParcelStatus(parcelId, status);
    sendStatusUpdateEmail(parcel.receiverEmail, status);
    res.json(parcel);
};

exports.getParcelsByUser = async (req, res) => {
    const { userId } = req.params;
    const parcels = await getParcelsByUser(userId);
    res.json(parcels);
};