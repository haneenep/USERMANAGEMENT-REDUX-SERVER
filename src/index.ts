import express, { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv'
import {USERDB} from './config/mongodb'
import cookieParser from "cookie-parser";
import cors from 'cors'
import userRouter from './routes/userRouter'
import adminRouter from './routes/adminRouter';

dotenv.config()

USERDB()

const app = express()

app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials : true
}))

app.use(express.json());
app.use(cookieParser());

app.use("/",userRouter);
app.use("/admin",adminRouter);

// handling error
app.use((error : any, req : Request, res : Response, next : NextFunction) => {
    console.log(error);
    res.status(500).json(error.message)
})

const PORT = process.env.PORT

app.listen(PORT,(error ?: any) => {
    if(error){
        console.log("Some Error while listening to port",error);
    } else {
        console.log(`server is running in the port of ${PORT}`);
        
    }
})