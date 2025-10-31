create database SeedDatabase;
use SeedDatabase;

CREATE TABLE User (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
	profile_picture_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Alimentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  calorias DECIMAL(6,2),
  proteina DECIMAL(6,2),
  carboidrato DECIMAL(6,2),
  gordura DECIMAL(6,2),
  fibra DECIMAL(6,2),
  unidade_medida VARCHAR(50) DEFAULT '100g'
);

CREATE TABLE Refeicoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  FOREIGN KEY (id_user) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE AlimentosRefeicoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_alimento INT NOT NULL,
  id_refeicao INT NOT NULL,
  quantidade INT NOT NULL,
  FOREIGN KEY (id_alimento) REFERENCES Alimentos(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_refeicao) REFERENCES Refeicoes(id) ON DELETE CASCADE ON UPDATE CASCADE
);


INSERT INTO alimentos (nome, categoria, calorias, proteina, carboidrato, gordura, fibra) VALUES
('Arroz branco cozido', 'Cereais', 128.0, 2.5, 28.0, 0.2, 1.6),
('Feijão carioca cozido', 'Leguminosas', 76.0, 4.8, 13.6, 0.5, 8.5),
('Lentilha cozida', 'Leguminosas', 93.0, 7.6, 16.4, 0.4, 7.9),
('Grão-de-bico cozido', 'Leguminosas', 164.0, 8.9, 27.4, 2.6, 7.6),
('Ervilha cozida', 'Leguminosas', 84.0, 5.4, 14.5, 0.4, 5.5),
('Tofu firme', 'Derivados de soja', 76.0, 8.0, 1.9, 4.8, 0.3),
('Tempeh', 'Derivados de soja', 192.0, 20.3, 7.6, 10.8, 1.4),
('Soja cozida', 'Leguminosas', 172.0, 16.6, 9.9, 9.0, 6.0),
('Pão integral', 'Cereais', 252.0, 9.5, 43.0, 3.3, 6.0),
('Aveia em flocos', 'Cereais', 393.0, 13.9, 66.6, 8.5, 9.1),
('Quinoa cozida', 'Cereais', 120.0, 4.1, 21.3, 1.9, 2.8),
('Milho verde cozido', 'Cereais', 96.0, 3.3, 20.7, 1.5, 2.7),
('Batata doce cozida', 'Tubérculos', 77.0, 0.6, 17.2, 0.1, 2.5),
('Mandioca cozida', 'Tubérculos', 151.0, 0.6, 36.0, 0.3, 1.8),
('Inhame cozido', 'Tubérculos', 97.0, 1.5, 23.8, 0.2, 2.7),
('Abóbora cozida', 'Hortaliças', 48.0, 1.0, 12.3, 0.1, 2.5),
('Brócolis cozido', 'Hortaliças', 25.0, 2.2, 4.4, 0.3, 3.3),
('Espinafre cozido', 'Hortaliças', 23.0, 2.8, 3.8, 0.3, 2.4),
('Couve refogada', 'Hortaliças', 56.0, 2.9, 5.1, 3.7, 3.5),
('Repolho cozido', 'Hortaliças', 23.0, 1.3, 5.5, 0.1, 2.1),
('Alface crua', 'Hortaliças', 15.0, 1.4, 2.9, 0.2, 1.8),
('Cenoura crua', 'Hortaliças', 40.0, 1.0, 9.3, 0.2, 3.0),
('Beterraba cozida', 'Hortaliças', 49.0, 1.6, 10.8, 0.1, 3.2),
('Tomate cru', 'Hortaliças', 21.0, 0.9, 4.7, 0.2, 1.2),
('Pepino cru', 'Hortaliças', 15.0, 0.7, 3.6, 0.1, 0.8),
('Abobrinha cozida', 'Hortaliças', 19.0, 1.1, 4.4, 0.1, 1.3),
('Pimentão cru', 'Hortaliças', 20.0, 0.9, 4.8, 0.2, 1.5),
('Banana prata', 'Frutas', 98.0, 1.0, 26.0, 0.2, 2.6),
('Maçã com casca', 'Frutas', 63.0, 0.2, 16.6, 0.2, 2.0),
('Mamão formosa', 'Frutas', 45.0, 0.5, 11.2, 0.1, 1.8),
('Abacate', 'Frutas', 96.0, 1.2, 6.0, 8.4, 3.5),
('Laranja', 'Frutas', 51.0, 0.9, 11.8, 0.2, 2.3),
('Pera', 'Frutas', 53.0, 0.3, 14.0, 0.1, 2.2),
('Manga', 'Frutas', 60.0, 0.8, 15.0, 0.2, 1.6),
('Uva', 'Frutas', 69.0, 0.7, 18.1, 0.4, 0.9),
('Amêndoas', 'Oleaginosas', 579.0, 21.2, 21.6, 49.9, 12.5),
('Castanha-do-pará', 'Oleaginosas', 656.0, 14.3, 12.3, 66.4, 7.9),
('Nozes', 'Oleaginosas', 654.0, 15.2, 13.7, 65.2, 6.7),
('Amendoim', 'Oleaginosas', 567.0, 25.8, 16.1, 49.2, 8.5),
('Tahine', 'Pasta de sementes', 595.0, 17.0, 21.2, 53.8, 9.3);


CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, 
    title VARCHAR(255) NOT NULL, 
    content TEXT NOT NULL, 
    image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE   
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE (post_id, user_id)  
);

CREATE TABLE favorites(
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE (post_id, user_id)
);