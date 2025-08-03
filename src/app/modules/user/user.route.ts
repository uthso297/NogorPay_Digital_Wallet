import { Request, Response, Router } from "express";
import { validateRequest } from "../../middlewars/validateRequest";
import { UserController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";


const router = Router()
router.get('/', (req: Request, res: Response) => {
    res.send('this is user routes');
})

router.post('/register', validateRequest(createUserZodSchema), UserController.createUser)

export const UserRoutes = router