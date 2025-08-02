import dotenv from "dotenv";
dotenv.config()

interface EnvConfig {
    PORT: string;
    DB_URL: string;
    NODE_ENV: 'development' | 'production';

}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ['PORT', 'DB_URL', 'NODE_ENV'];

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production'
    }

}

export const envVars = loadEnvVariables()