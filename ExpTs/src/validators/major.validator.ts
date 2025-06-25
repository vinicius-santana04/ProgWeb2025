import Joi from 'joi';

export const createMajorSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': `"Nome" deve ser um texto.`,
            'string.empty': `"Nome" não pode ser vazio.`,
            'string.min': `"Nome" deve ter no mínimo {#limit} caracteres.`,
            'any.required': `"Nome" é um campo obrigatório.`
        }),
    code: Joi.string()
        .length(4)
        .required()
        .messages({
            'string.length': `"Código" deve ter exatamente {#limit} caracteres.`,
            'any.required': `"Código" é um campo obrigatório.`
        }),
    description: Joi.string()
        .max(5000)
        .allow('')
        .optional()
});

export const updateMajorSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    code: Joi.string().length(4).optional(),
    description: Joi.string().max(5000).allow('').optional()
}).min(1);