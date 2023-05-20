import * as Yup from 'yup'

export const createPostSchema = Yup.object({
    body: Yup.string()
        .required('Body is required'),
    categoryId: Yup.number()
        .required('Topic is required'),
    tags: Yup.string()
        .required('Tag is required')
}).noUnknown()