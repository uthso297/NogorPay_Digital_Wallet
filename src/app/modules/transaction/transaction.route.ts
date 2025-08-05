import { Request, Response, Router } from "express";
import { validateRequest } from "../../middlewars/validateRequest";
import { addMoneyZodSchema } from "./transaction.validation";
import { checkAuth } from "../../middlewars/chekAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";


const router = Router()
router.get('/', (req: Request, res: Response) => {
    res.send('this is transaction route');
})

router.post('/addMoney', checkAuth(Role.USER), validateRequest(addMoneyZodSchema), TransactionController.addMoney)

export const TranscationRoutes = router