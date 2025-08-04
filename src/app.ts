import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
import { globalErrorHandler } from './app/middlewars/globalErrorHandler'
import './app/config/passport'
import { notFound } from './app/middlewars/notFound'
import { router } from './app/Routes'
import httpStatus from 'http-status-codes'
import passport from 'passport';


const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser());
app.use(passport.initialize())

app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        message: 'Welcome to NogorPay,a Digital Wallet Server 😍'
    })
})


app.use(globalErrorHandler)
app.use(notFound)

export default app;
