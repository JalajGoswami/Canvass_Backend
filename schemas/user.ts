import * as Yup from 'yup'

export const createProfileSchema = Yup.object({
    email: Yup.string()
        .email('Not a valid Email')
        .required('Email is required'),
    user_name: Yup.string()
        .required('UserName is required')
        .min(3, 'UserName too short')
        .lowercase('UserName must be lowercase').strict()
        .matches(/^\S+$/, 'UserName have spaces'),
    full_name: Yup.string()
        .required('FullName is required')
        .min(3, 'FullName too short'),
    password: Yup.string()
        .min(8, 'Password atleast have 8 digits')
        .max(20, 'Password too long')
        .required('Password is required'),
    confirm_password: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('ConfirmPassword is required'),
    about: Yup.string()
        .max(200, 'About exceed 200char')
}).noUnknown()