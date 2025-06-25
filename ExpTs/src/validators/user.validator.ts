import Joi from 'joi';

const passwordSchema = Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
        'string.empty': 'O campo de senha é obrigatório.',
        'string.min': 'A senha deve ter no mínimo {#limit} caracteres.',
        'string.max': 'A senha deve ter no máximo {#limit} caracteres.',
        'any.required': 'O campo de senha é obrigatório.',
    });

export const createUserSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(5)
        .max(150)
        .required()
        .messages({
            'string.empty': 'O nome é obrigatório.',
            'string.min': 'O nome deve ter no mínimo {#limit} caracteres.',
            'string.max': 'O nome deve ter no máximo {#limit} caracteres.',
            'any.required': 'O nome é obrigatório.',
        }),

    email: Joi.string()
        .trim()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'O email é obrigatório.',
            'string.email': 'Por favor, insira um email válido.',
            'any.required': 'O email é obrigatório.',
        }),

    majorId: Joi.string()
        .trim()
        .uuid()
        .required()
        .messages({
            'string.base': 'A seleção do curso é inválida.',
            'string.empty': 'A seleção do curso é obrigatória.',
            'string.guid': 'Você deve selecionar um curso válido.',
            'any.required': 'A seleção do curso é obrigatória.',
        }),

    password: passwordSchema,

    passwordConfirmation: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'As senhas não conferem.',
            'any.required': 'A confirmação de senha é obrigatória.',
        }),
});

export const updateProfileSchema = Joi.object({
    name: Joi.string().trim().min(3).max(150).optional(),
    email: Joi.string().trim().email({ tlds: { allow: false } }).optional(),
    currentPassword: Joi.string().required().messages({
        'string.empty': 'A senha atual é obrigatória para salvar as alterações.',
        'any.required': 'A senha atual é obrigatória para salvar as alterações.',
    }),
})
.min(1)
.messages({
    'object.min': 'Você deve fornecer pelo menos um campo (nome ou email) para atualizar.',
});


export const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'string.empty': 'A senha atual é obrigatória.',
        'any.required': 'A senha atual é obrigatória.',
    }),
    newPassword: passwordSchema.invalid(Joi.ref('currentPassword')).messages({
        'any.invalid': 'A nova senha não pode ser igual à senha atual.',
    }),
    passwordConfirmation: Joi.any().equal(Joi.ref('newPassword')).required().messages({
        'any.only': 'As senhas não conferem.',
        'any.required': 'A confirmação de senha é obrigatória.',
    }),
});
