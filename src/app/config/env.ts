import dotenv from "dotenv";
dotenv.config()

interface EnvConfig {
    PORT: string;
    DB_URL: string;
    NODE_ENV: 'development' | 'production';
    BCRYPT_SALT_ROUND: string

}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ['PORT', 'DB_URL', 'NODE_ENV', 'BCRYPT_SALT_ROUND'];

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string
    }

}

export const envVars = loadEnvVariables()