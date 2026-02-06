const Joi = require('joi');

const createAttendanceRegularizationDraftSchema = Joi.object({
    Code: Joi.number().required().messages({
        'number.base': 'Code must be a number',
        'any.required': 'Code is required'
    }),

    U_PrjCode: Joi.string().required().messages({
        'string.base': 'Project Code must be a string',
        'any.required': 'Project Code is required'
    }),

    U_PrjName: Joi.string().required().messages({
        'string.base': 'Project Name must be a string',
        'any.required': 'Project Name is required'
    }),

    U_Task: Joi.string().required().messages({
        'string.base': 'Task must be a string',
        'any.required': 'Task is required'
    }),

    U_InTime: Joi.string().required().messages({
        'string.base': 'In Time must be a string',
        'any.required': 'In Time is required'
    }),

    U_OutTime: Joi.string().required().messages({
        'string.base': 'Out Time must be a string',
        'any.required': 'Out Time is required'
    }),

    U_AttDt: Joi.string().required().messages({
        'string.base': 'In Date must be a string',
        'any.required': 'In Date is required'
    }),

    U_OAttDt: Joi.string().required().messages({
        'string.base': 'Out Date must be a string',
        'any.required': 'Out Date is required'
    }),

});

function validate(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        next();
    };
}

module.exports = {
    createAttendanceRegularizationDraftSchema,
    validate
};
