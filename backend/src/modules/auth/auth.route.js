import express from "express"
import Auth from "./auth.ctrl"

const router=express.Router()

router.post('/register',Auth.register)