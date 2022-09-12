import { signInSchema } from "../schemas/signInSchema.js";

function signInMiddleware(req, res, next) {

    const signInValidation = signInSchema.validate(req.body, {abortEarly: false});
    
    if (signInValidation.error) {
        const messages = signInValidation.error.details.map(detail => detail.message);
        return res.status(422).send(messages);
    };

    next();
}

export { signInMiddleware };