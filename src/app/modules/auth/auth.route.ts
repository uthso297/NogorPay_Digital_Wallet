import { Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.send('auth route')
})

router.post('/login', AuthController.credentialsLogin)

export const AuthRoutes = router