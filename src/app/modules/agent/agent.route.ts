import { Router } from "express";
import { validateRequest } from "../../middlewars/validateRequest";
import { createAgentZodSchema } from "./agent.validation";
import { AgentController } from "./agent.controller";


const router = Router()

router.post('/register', validateRequest(createAgentZodSchema), AgentController.createAgent)

export const AgentRoutes = router