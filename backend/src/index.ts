import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { testConnection } from './config/db'
import { initializeDatabase } from './config/initDb'
import env from './config/env'
import authRoutes from './routes/auth'
import artistRoutes from './routes/artist'
import songRoutes from './routes/song'
import userRoutes from './routes/user'

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser()) 

app.use('/api/auth', authRoutes)
app.use('/api/artists', artistRoutes)
app.use('/api/songs', songRoutes)
app.use('/api/users', userRoutes)

const start = async () => {
  await testConnection()
  await initializeDatabase()
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`)
  })
}

start()

export default app