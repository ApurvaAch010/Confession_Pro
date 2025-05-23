import express from "express"

const exp=express.Router()

const router=exp

router.use('/auth',(req,res)=>{
    res.json({
        message:"Hello"
    })
})



router.use("/",(req,res)=>{
    res.json({
        result:{},
        messgae:"You have entered the wrong url",
        meta:null
    })
})

export default router