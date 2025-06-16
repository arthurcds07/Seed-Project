create database SeedDatabase;
use SeedDatabase;

CREATE TABLE User (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL UNIQUE,
	profile_picture VARCHAR(255), -- vou armazenar em outro lugar e deixar só a URL no banco
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

