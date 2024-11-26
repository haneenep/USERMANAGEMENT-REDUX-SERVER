import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const URI  = process.env.MONGO_URI;

if(!URI){
    throw new Error("Some Error in the URI")
}

export const USERDB = () => {
    return mongoose.connect(URI)
    .then(() => {
        console.log("Successfully connected to db");
    }).catch((error) => {
        console.log("Error while connecting to db",error);
    })
}
