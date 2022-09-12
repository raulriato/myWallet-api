import express from "express";
import cors from "cors";
import authRouter from "./routers/auth.routers.js";
import transactionsRouter from "./routers/transactions.routers.js";

const server = express();

server.use(express.json());
server.use(cors());
server.use(authRouter);
server.use(transactionsRouter);




server.listen(5000, () => console.log("listening on port 5000"))