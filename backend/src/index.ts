import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { testConnection } from './config/db'
import { initializeDatabase } from './config/initDb'
import env from './config/env'
import routes from './routes'; 

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser()) 

app.use('/api', routes);

const start = async () => {
  await testConnection()
  await initializeDatabase()
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`)
  })
}

start()

export default app