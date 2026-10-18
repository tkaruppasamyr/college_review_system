const Joi = require('joi');


export const CreateCollegeSchema = Joi.object({
    aishe_code: Joi.string().trim().required().min(4).max(10).messages({
        'string.empty': 'AISHE code is required',
        'string.min': 'AISHE code must be at least 4 characters long',
    }),
    college_name: Joi.string().trim().required(),    
    clg_loc_name: Joi.string().trim().optional().allow(''),
    city: Joi.string().trim().optional().allow(''),
    state: Joi.string().trim().optional().allow(''),
    country: Joi.string().trim().optional().allow(''),
});