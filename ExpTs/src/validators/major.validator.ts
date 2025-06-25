import Joi from 'joi';

export const createMajorSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(5)
        .max(100)
        .required()
        .messages({
            'string.empty': 'O campo "Nome" não pode ser vazio.',
            'string.min': 'O campo "Nome" deve ter no mínimo {#limit} caracteres.',
            'string.max': 'O campo "Nome" deve ter no máximo {#limit} caracteres.',
            'any.required': 'O campo "Nome" é obrigatório.'
        }),
    
    code: Joi.string()
        .trim()
        .uppercase()
        .length(4)
        .pattern(/^[A-Z0-9]{4}$/)
        .required()
        .messages({
            'string.empty': 'O campo "Código" não pode ser vazio.',
            'string.length': 'O campo "Código" deve ter exatamente {#limit} caracteres.',
            'string.pattern.base': 'O campo "Código" deve conter apenas letras e números.',
            'any.required': 'O campo "Código" é um campo obrigatório.'
        }),
        
    description: Joi.string()
        .trim()
        .max(5000)
        .allow('')
        .optional()
        .messages({
            'string.max': 'A descrição não pode ter mais de {#limit} caracteres.'
        })
});

export const updateMajorSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .messages({
            'string.min': 'O campo "Nome" deve ter no mínimo {#limit} caracteres.',
            'string.max': 'O campo "Nome" deve ter no máximo {#limit} caracteres.',
        }),
        
    code: Joi.string()
        .trim()
        .uppercase()
        .length(4)
        .pattern(/^[A-Z0-9]{4}$/)
        .messages({
            'string.length': 'O campo "Código" deve ter exatamente {#limit} caracteres.',
            'string.pattern.base': 'O campo "Código" deve conter apenas letras e números.',
        }),
        
    description: Joi.string()
        .trim()
        .max(5000)
        .allow('')
        .messages({
            'string.max': 'A descrição não pode ter mais de {#limit} caracteres.'
        })
}).min(1).messages({
    'object.min': 'Você deve fornecer pelo menos um campo para atualizar.'
});