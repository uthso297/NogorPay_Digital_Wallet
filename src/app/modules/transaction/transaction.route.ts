import { Router } from "express";
import { validateRequest } from "../../middlewars/validateRequest";
import { addMoneyZodSchema, cashInZodSchema, sendMoneyZodSchema, withdrawZodSchema } from "./transaction.validation";
import { checkAuth } from "../../middlewars/chekAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";


const router = Router()

router.get('/user/me', checkAuth(Role.USER), TransactionController.getUserTransaction)
router.post('/user/addMoney', checkAuth(Role.USER), validateRequest(addMoneyZodSchema), TransactionController.addMoney)
router.post('/user/withdraw', checkAuth(Role.USER), validateRequest(withdrawZodSchema), TransactionController.withdrawMoney)
router.post('/user/send', checkAuth(Role.USER), validateRequest(sendMoneyZodSchema), TransactionController.sendMoney);
router.post('/agent/cashIn', checkAuth(Role.AGENT), validateRequest(cashInZodSchema), TransactionController.cashIn)
export const TranscationRoutes = router