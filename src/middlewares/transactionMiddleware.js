import { transactionSchema } from "../schemas/transactionSchema.js";

function transactionMiddleware(req, res, next) {
    const transactionValidation = transactionSchema.validate(req.body, {abortEarly: false});

    if (transactionValidation.error) {
        const messages = transactionValidation.error.details.map(detail => detail.message);
        return res.status(422).send(messages);
    };

    next();
};

export { transactionMiddleware }