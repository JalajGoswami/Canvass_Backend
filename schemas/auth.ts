import * as Yup from 'yup'

export const verifyEmailSchema = Yup.object({
    email: Yup.string()
        .email('Not a valid Email')
        .required('Email is required')
})