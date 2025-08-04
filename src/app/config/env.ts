import dotenv from "dotenv";
dotenv.config()

interface EnvConfig {
    PORT: string;
    DB_URL: string;
    NODE_ENV: 'development' | 'production';
    BCRYPT_SALT_ROUND: string;
    JWT_SECRET: string;
    JWT_ACCESS_EXPIRES: string;
    ADMIN_EMAIL: string;
    ADMIN_PASS: string
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ['PORT', 'DB_URL', 'NODE_ENV', 'BCRYPT_SALT_ROUND', 'JWT_SECRET', 'JWT_ACCESS_EXPIRES', 'ADMIN_EMAIL', 'ADMIN_PASS'];

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASS: process.env.ADMIN_PASS as string
    }

}

export const envVars = loadEnvVariables()