import { db } from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

async function signUp(req, res) {
    const { name, email, password } = req.body;
    const isNotValidEmail = await db.collection("users").findOne({ email: email });

    if (isNotValidEmail) {
        res.sendStatus(409);
        return;
    };

    const hashPassword = bcrypt.hashSync(password, 12);

    try {
        const response = await db.collection("users").insertOne({
            name,
            email,
            password: hashPassword
        });
        res.status(201).send("Cadastrado com sucesso");
    } catch (error) {
        console.error(error)
    }
}

async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        const user = await db.collection("users").findOne({ email });
        const session = await db.collection("sessions").findOne({ email });

        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (!isValidPassword) {
            return res.sendStatus(401);
        }

        if (session) {
            await db.collection("sessions").deleteOne(session)
        }

        const token = uuidv4();

        db.collection("sessions").insertOne({
            token,
            userId: user._id
        });

        res.status(201).send({
            email,
            token,
            name: user.name
        })
    } catch (error) {
        console.error(error);
    }
}

export {
    signUp,
    signIn
}