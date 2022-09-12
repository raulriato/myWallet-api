import { db } from "../database/db.js";

async function listTransactions(req, res) {
    const user = res.locals.user;

    const token = req.headers.authorization?.replace("Bearer ", "");
    
    try {
        const transactions = await db.collection("transactions").find({ userId: user._id }).toArray();
        res.status(200).send(transactions);
    } catch (error) {
        console.error(error);
    }
};

async function createTransaction(req, res) {
    const { value, description, date } = req.body;
    const user = res.locals.user;

    try {
        await db.collection("transactions").insertOne({
            value,
            description,
            date,
            userId: user._id
        })

        res.status(201).send("transação registrada com sucesso");
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

export {
    listTransactions,
    createTransaction
}