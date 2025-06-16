import * as Yup from 'yup';

const postConf = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters'),
    content: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters'),
    is_anonymous: Yup.bool()
});

const updateConf = Yup.object({
    title: Yup.string()
        .min(3, 'Title must be at least 3 characters'),
    content: Yup.string()
        .min(10, 'Description must be at least 10 characters'),
    is_anonymous: Yup.bool()
});

export {
    postConf,
    updateConf
}