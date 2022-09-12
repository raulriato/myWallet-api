import joi from "joi";

const transactionSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().trim().required(),
    date: joi.string().required()
});

export { transactionSchema };