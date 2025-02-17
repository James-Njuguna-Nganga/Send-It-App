const Joi = require('joi');

exports.validateParcel = (req, res, next) => {
    const schema = Joi.object({
        userId: Joi.number().required(),
        pickupLocation: Joi.string().required(),
        destination: Joi.string().required(),
        receiverEmail: Joi.string().email().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
};
