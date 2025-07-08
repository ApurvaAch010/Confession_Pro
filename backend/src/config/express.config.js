import express from "express"
import router from "../routing/router.js"
import "./database.connection.js"
import cors from "cors"

const app=express()

app.use(cors(
    {
        origin: "*",
        credentials: true,
    }
))

app.use(express.json())
app.use(express.urlencoded({
    extended:false
}))
app.use("/confess",router);

app.use((req,res,next)=>{
    next({code:404,messsage:"not found",detail:""})
})




export default app