import express from "express"
import Auth from "./auth.ctrl.js"
import {bodyvalidator} from "../../middleware/validator.js"
import {loginVal, registerVal} from "./auth.validation.js"
import LoginCheck from "../../middleware/login.middleware.js"

const router=express.Router()

router.post('/register',bodyvalidator(registerVal),Auth.register)
router.post('/login',bodyvalidator(loginVal),Auth.login)
router.get('/dashboard',LoginCheck,Auth.dashboard)

export default router