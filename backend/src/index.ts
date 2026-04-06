import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { testConnection } from './config/db'
import { initializeDatabase } from './config/initDb'
import env from './config/env'
import authRoutes from './routes/auth'
import { authenticateToken } from './middleware/auth'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected route',
    user: req.user,
  })
})

const start = async () => {
  await testConnection()
  await initializeDatabase()
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`)
  })
}

start()

export default app