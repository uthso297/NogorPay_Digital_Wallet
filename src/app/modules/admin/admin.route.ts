import { Router } from "express";
import { checkAuth } from "../../middlewars/chekAuth";
import { Role } from "../user/user.interface";
import { AdminController } from "./admin.controller";


const router = Router()

router.get('/users', checkAuth(Role.ADMIN), AdminController.getUsers)
router.get('/agents', checkAuth(Role.ADMIN), AdminController.getAgents)
router.get('/wallets', checkAuth(Role.ADMIN), AdminController.getWallets)
router.post('/wallet/block/:id', checkAuth(Role.ADMIN), AdminController.blockWallet)
router.post('/wallet/unblock/:id', checkAuth(Role.ADMIN), AdminController.unblockWallet)
router.post('/agent/approve/:id', checkAuth(Role.ADMIN), AdminController.approveAgent)
router.post('/agent/suspend/:id', checkAuth(Role.ADMIN), AdminController.suspendAgent)

export const AdminRoutes = router