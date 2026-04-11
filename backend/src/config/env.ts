interface EnvConfig {
  port: number;
  db: {
    host: string;
    user: string;
    password: string;
    name: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

// Ensure required env vars are set
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables!");
}

const env: EnvConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 8000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'artist_management',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d', 
  },
}

export default env;