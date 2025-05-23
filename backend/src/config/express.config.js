import express from "express"
import router from "../routing/router.js"

const app=express()


app.use(express.json())
app.use(express.urlencoded({
    extended:false
}))
app.use("/confess",router);

app.use((req,res,next)=>{
    next({code:404,messsage:"not found",detail:""})
})




export default app