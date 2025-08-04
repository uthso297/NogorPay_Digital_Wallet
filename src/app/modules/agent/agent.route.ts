import { Request, Response, Router } from "express";
import { validateRequest } from "../../middlewars/validateRequest";
import { createAgentZodSchema } from "./agent.validation";
import { AgentController } from "./agent.controller";


const router = Router()
router.get('/', (req: Request, res: Response) => {
    res.send('this is Agent route');
})

router.post('/register', validateRequest(createAgentZodSchema), AgentController.createAgent)

export const AgentRoutes = router