import { Request, Response, Router } from "express";
import { checkAuth } from "../../middlewars/chekAuth";
import { Role } from "../user/user.interface";
import { AdminController } from "./admin.controller";


const router = Router()

router.get('/', checkAuth(Role.ADMIN), (req: Request, res: Response) => {
    res.send('this is admin route');
})

router.get('/users', checkAuth(Role.ADMIN), AdminController.getUsers)
router.get('/agents', checkAuth(Role.ADMIN), AdminController.getAgents)


export const AdminRoutes = router