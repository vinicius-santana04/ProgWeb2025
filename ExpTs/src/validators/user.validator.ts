import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().min(3).max(150).required(),
    email: Joi.string().email().required(),
    majorId: Joi.string().uuid().required().messages({
        'string.guid': 'Você deve selecionar um curso válido.'
    }),
    password: Joi.string().min(8).required(),
    passwordConfirmation: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .messages({ 'any.only': 'A confirmação de senha não confere.' })
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(150).optional(),
    email: Joi.string().email().optional(),
    majorId: Joi.string().uuid().optional()
}).min(1);