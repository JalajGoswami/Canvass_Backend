import * as Yup from 'yup'

export const verifyEmailSchema = Yup.object({
    email: Yup.string()
        .email('Not a valid Email')
        .required('Email is required')
}).noUnknown()

export const verifyCodeSchema = Yup.object({
    email: Yup.string()
        .email('Not a valid Email')
        .required('Email is required'),
    code: Yup.number()
        .integer('Code must be number')
        .required('Code is required')
}).noUnknown()

export const loginSchema = Yup.object({
    email: Yup.string()
        .email('Not a valid Email')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
}).noUnknown()