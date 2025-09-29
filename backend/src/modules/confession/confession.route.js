import express from "express"
import Confess from "./confession.ctrl.js"
import { bodyvalidator } from "../../middleware/validator.js"
import {postConf, updateConf} from "./confession.validation.js"
import LoginCheck from "../../middleware/login.middleware.js"

const router=express.Router()


router.post('/create',bodyvalidator(postConf),LoginCheck,Confess.create)

router.get('/getAll',Confess.getAll)

router.get('/get/:id',LoginCheck,Confess.getPostById)

router.post('/toggle-like',LoginCheck,Confess.toggleLike)

router.put('/update/:id',bodyvalidator(updateConf),LoginCheck,Confess.update)

router.delete('/delete/:id',LoginCheck,Confess.delete)

export default router

