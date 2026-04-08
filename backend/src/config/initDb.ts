import pool from './db';

export const initializeDatabase = async () => {
  try {
    // Drop existing users table if it exists (to update schema)
    await pool.execute('DROP TABLE IF EXISTS users');

    // Create users table
    await pool.execute(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        dob DATE,
        gender ENUM('male', 'female', 'other'),
        address TEXT,
        is_admin TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create artists table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS artists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        dob DATE,
        gender ENUM('male', 'female', 'other') NOT NULL,
        address TEXT,
        first_release_year YEAR,
        no_of_albums_released INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create songs table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS songs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        artist_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        album_name VARCHAR(255),
        genre ENUM('pop', 'rock', 'jazz', 'classical', 'hip-hop', 'electronic', 'country', 'other') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};