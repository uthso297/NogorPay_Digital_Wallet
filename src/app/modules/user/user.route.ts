import { Request, Response, Router } from "express";


const router = Router()
router.get('/', (req: Request, res: Response) => {
    res.send('this is user routes');
})

export const UserRoutes = router