import { Router } from "express";
import { checkAuth } from "../../middlewars/chekAuth";
import { Role } from "../user/user.interface";

import { getMyWallet } from "./wallet.controller";


const router = Router()

router.get('/me', checkAuth(...Object.values(Role)), getMyWallet)

export const WalletRoutes = router