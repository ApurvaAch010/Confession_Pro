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

router.delete('/delete/:id',LoginCheck,Confess.delete)

router.get('/bin',LoginCheck,Confess.bin)

router.put('/restore/:id',LoginCheck,Confess.restore)

router.put('/autoDelete',LoginCheck,Confess.autoDeletePosts);

export default router

