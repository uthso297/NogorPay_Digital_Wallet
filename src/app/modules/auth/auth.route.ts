import { Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewars/chekAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.send('auth route')
})

router.post('/login', AuthController.credentialsLogin)
router.get('/me', checkAuth(...Object.values(Role)), AuthController.getMe)

export const AuthRoutes = router