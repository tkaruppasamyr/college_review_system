const Joi = require('joi');

export const UserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    is_admin: Joi.boolean().default(false),
    is_teacher: Joi.boolean().default(false),
    is_student: Joi.boolean().default(false),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false),
    create_at: Joi.date().default(Date.now),
    last_login: Joi.date()
});

export const LoginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
});

export const RegisterSchema = Joi.object({
    first_name: Joi.string().lowercase().required(),
    last_name: Joi.string().lowercase().min(1).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
    is_admin: Joi.boolean().default(false),
    is_teacher: Joi.boolean().default(false),
    is_student: Joi.boolean().default(false),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false),
    create_at: Joi.date().default(Date.now),
    last_login: Joi.date()
});