import mongoose from "mongoose";
import express from 'express'
await mongoose.connect(process.env.mongooseDB_URL)
import championsRouter from "./routes/championsRouter.js";

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
    next()
})


app.use((req, res, next) => {
    const acceptHeader = req.headers['accept'];

    console.log(`Client accepteert: ${acceptHeader}`);

    if ((acceptHeader && acceptHeader.includes('application/json')) || req.method === 'OPTIONS') {
        next();
    } else {
        res.status(406).send('Illegal format');
    }
})

app.use('/', championsRouter)

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port! ${process.env.EXPRESS_PORT}`);
});