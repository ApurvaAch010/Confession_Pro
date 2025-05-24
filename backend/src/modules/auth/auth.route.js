import express from "express"
import Auth from "./auth.ctrl.js"
import bodyvalidator from "../../middleware/validator.js"
import {registerVal} from "./auth.validation.js"

const router=express.Router()

router.post('/register',bodyvalidator(registerVal),Auth.register)
router.post('/activation/:token',Auth.activation)
router.get('/dashboard',Auth.dashboard)

router.post('/login',Auth.register)

export default router