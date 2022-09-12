import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const server = express();

server.use(express.json());
server.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db("mywallet");
});

server.post("/sign-up", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const isNotValidEmail = await db.collection("users").findOne({ email: email });

    const signUpSchema = joi.object({
        name: joi.string().trim().required(),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: joi.string().required(),
        confirmPassword: joi.ref("password")
    });

    const signUpValidation = signUpSchema.validate(req.body, {abortEarly: false});

    if (signUpValidation.error) {
        const messages = signUpValidation.error.details.map(detail => detail.message);
        res.status(422).send(messages);
        return;
    };

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
});

server.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;

    const signInSchema = joi.object({
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: joi.string().required()
    });

    const signInValidation = signInSchema.validate(req.body, {abortEarly: false});
    
    if (signInValidation.error) {
        const messages = signInValidation.error.details.map(detail => detail.message);
        res.status(422).send(messages);
        return;
    }

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
});

server.listen(5000, () => console.log("listening on port 5000"))