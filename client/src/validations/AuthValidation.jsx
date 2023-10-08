import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string().lowercase().trim().email('Invalid email format').required('Please enter your email'),
    password: Yup.string().required('Please enter your password'),
});

export const signUpValidationSchema = Yup.object().shape({
    email: Yup.string().lowercase().trim().email('Invalid email format').required('Please enter email'),
    firstName: Yup.string().trim().required('Please enter first name'),
    lastName: Yup.string().trim().required('Please enter last name'),
    phoneNumber: Yup.string()
        .required('Please enter phone number')
        .matches(
            /^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/,
            'Invalid Phone Number',
        ),
    password: Yup.string()
        .required('Please enter password')
        .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            'Password must contain at least 8 characters, one uppercase, one number and one special case character.Ex(John123@)',
        ),
    confirmPassword: Yup.string()
        .required('Please enter confirm password')
        .oneOf([Yup.ref('password')], 'Password not match!!'),
});
