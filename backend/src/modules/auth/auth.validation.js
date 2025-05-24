import Yup, { string } from "yup"

const registerVal=Yup.object({
    username:string().required(),
    email:string().email(),
    password:string().required("password is required").matches(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, "Password must contain at least 8 characters, one uppercase, one number and one special case character"),
    confirmPassword:string()
    .required("Please confirm your password")
    .oneOf([Yup.ref('password'), null], "Passwords don't match.")
    
})

export {registerVal}