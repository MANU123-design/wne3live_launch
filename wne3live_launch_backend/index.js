import  express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import us from "./api/routes/route.js"
import {config} from "dotenv";
config({path:"./api/config/config.env"});



const app=express();

app.use(cors()); 
app.use(bodyParser.urlencoded({extended:false})) ;   
app.use(bodyParser.json());

mongoose.connect(process.env.MDATABASE)

mongoose.connection.on('error', err => {
    console.log("Connection failed");
});

mongoose.connection.on('connected', connected => {
    console.log("Connection successful");
});

app.use('/',us);

app.use((req,res,next)=>{
    res.status(404).json({
        msg:'bad request'
    })
})


const PORT=process.env.PORT||6000;


app.listen(PORT, () => {
    console.log(`server is running on port  http://localhost:${PORT}`); 
});