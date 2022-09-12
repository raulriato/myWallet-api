import joi from "joi";

const signUpSchema = joi.object({
    name: joi.string().trim().required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi.string().required(),
    confirmPassword: joi.ref("password")
});

export { signUpSchema };