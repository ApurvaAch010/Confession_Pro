import express from "express"
import AuthRouter from "../modules/auth/auth.route.js"
import ConfessRouter from "../modules/confession/confession.route.js"

const router=express.Router()

router.use('/auth',AuthRouter)
router.use('/posts',ConfessRouter)



router.use("/",(req,res)=>{
    res.status(404).json({
        result:{},
        message:"You have entered the wrong url",
        meta:null
    })
})

export default router