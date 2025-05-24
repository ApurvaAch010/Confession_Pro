import express from "express"
import AuthRouter from "../modules/auth/auth.route.js"

const router=express.Router()

router.use('/auth',AuthRouter)



router.use("/",(req,res)=>{
    res.json({
        result:{},
        message:"You have entered the wrong url",
        meta:null
    })
})

export default router