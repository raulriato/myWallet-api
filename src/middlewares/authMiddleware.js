import { db } from "../database/db.js"

async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    console.log(token);

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const session = await db.collection("sessions").findOne({ token });

        if (!session) {
            return res.sendStatus(401);
        };

        const user = await db.collection("users").findOne({ _id: session.userId });

        if (!user) {
            return res.sendStatus(401);
        }

        res.locals.user = user;

        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export { authMiddleware };