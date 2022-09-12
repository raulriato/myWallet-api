import { signUpSchema } from "../schemas/signUpSchema.js";

function signUpMiddleware(req, res, next) {
    
    const signUpValidation = signUpSchema.validate(req.body, {abortEarly: false});
    
    if (signUpValidation.error) {
        const messages = signUpValidation.error.details.map(detail => detail.message);

        if (!req.body.confirmPassword) {
            messages.push("\"confirmPassword\" is required");
        };
        
        return res.status(422).send(messages);
    };

    if (!req.body.confirmPassword) {
        return res.status(422).send(["\"confirmPassword\" is required"]);
    };

    next();
};

export { signUpMiddleware };