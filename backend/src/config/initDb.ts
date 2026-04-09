import pool from './db';

export const initializeDatabase = async () => {
  try {
    // Create users table if it doesn't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(500) NOT NULL,
        phone VARCHAR(20),
        dob DATETIME,
        gender ENUM('male', 'female', 'other'),
        address VARCHAR(255),
        is_admin TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create artists table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS artists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        dob DATETIME,
        gender ENUM('male', 'female', 'other') NOT NULL,
        address VARCHAR(255),
        first_release_year YEAR,
        no_of_albums_released INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create songs table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS songs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        artist_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        album_name VARCHAR(255),
        genre ENUM('rnb', 'country', 'classic', 'rock', 'jazz') NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};