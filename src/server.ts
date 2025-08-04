import { Server } from 'http'
import app from './app'
import { envVars } from './app/config/env'
import mongoose from 'mongoose'
import { seedAdmin } from './app/utils/seedAdmin'

let server: Server

const startServer = async () => {
    try {

        await mongoose.connect(envVars.DB_URL)

        console.log('Connectet to mongodb 🥳');

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listening on port ${envVars.PORT} 😎`);
        })
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    await startServer()
    await seedAdmin()
})()


process.on("SIGINT", () => {
    console.log("SIGINT detected....server shutting down");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
