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

const env: EnvConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'artist_management',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
}

export default env