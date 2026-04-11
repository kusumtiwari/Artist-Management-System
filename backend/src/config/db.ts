// creates connection pool tp mysql database 
import dotenv from 'dotenv'
dotenv.config()   

import mysql from 'mysql2/promise'
    
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'artist_management',
  waitForConnections: true,
  connectionLimit: 10,
})

// connect to mysql db & test connection 
export const testConnection = async () => {
  try {
    const conn = await pool.getConnection()
    console.log(' MySQL connected')
    conn.release()
  } catch (err) {
    console.error('MySQL connection failed:', err)
    process.exit(1)
  }
}

export default pool