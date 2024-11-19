-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema cms_periodico
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema cms_periodico
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `cms_periodico` DEFAULT CHARACTER SET utf8 ;
USE `cms_periodico` ;

-- -----------------------------------------------------
-- Table `cms_periodico`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_periodico`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `contraseña` VARCHAR(255) NOT NULL,
  `rol` ENUM("admin", "editor", "redactor") NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cms_periodico`.`categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_periodico`.`categoria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `slug` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `slug_UNIQUE` (`slug` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cms_periodico`.`noticias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_periodico`.`noticias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titular` VARCHAR(50) NOT NULL,
  `imagen` VARCHAR(255) NOT NULL,
  `texto` LONGTEXT NOT NULL,
  `secciones` ENUM("principal", "secundario", "destacado") NOT NULL,
  `fecha_publicacion` DATE NOT NULL,
  `redactor_id` INT NOT NULL,
  `editor_id` INT NOT NULL,
  `categoria_id` INT NOT NULL,
  `estado` ENUM("revision", "publicado", "borrador") NOT NULL DEFAULT 'borrador',
  `importancia` INT NOT NULL,
  `cambios` LONGTEXT NULL,
  `slug` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_noticias_usuarios_idx` (`redactor_id` ASC) VISIBLE,
  INDEX `fk_noticias_usuarios1_idx` (`editor_id` ASC) VISIBLE,
  INDEX `fk_noticias_categoria1_idx` (`categoria_id` ASC) VISIBLE,
  UNIQUE INDEX `slug_UNIQUE` (`slug` ASC) VISIBLE,
  CONSTRAINT `fk_noticias_usuarios`
    FOREIGN KEY (`redactor_id`)
    REFERENCES `cms_periodico`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_noticias_usuarios1`
    FOREIGN KEY (`editor_id`)
    REFERENCES `cms_periodico`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_noticias_categoria1`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `cms_periodico`.`categoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cms_periodico`.`suscriptores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_periodico`.`suscriptores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(150) NOT NULL,
  `activo` TINYINT NOT NULL DEFAULT 0, 
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cms_periodico`.`suscriptores_categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_periodico`.`suscriptores_categoria` (
  `suscriptores_id` INT NOT NULL,
  `categoria_id` INT NOT NULL,
  PRIMARY KEY (`suscriptores_id`, `categoria_id`),
  INDEX `fk_suscriptores_has_categoria_categoria1_idx` (`categoria_id` ASC) VISIBLE,
  INDEX `fk_suscriptores_has_categoria_suscriptores1_idx` (`suscriptores_id` ASC) VISIBLE,
  CONSTRAINT `fk_suscriptores_has_categoria_suscriptores1`
    FOREIGN KEY (`suscriptores_id`)
    REFERENCES `cms_periodico`.`suscriptores` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_suscriptores_has_categoria_categoria1`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `cms_periodico`.`categoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


INSERT INTO `cms_periodico`.`usuarios` (`nombre`, `email`, `contraseña`, `rol`)
VALUES
('Juan Pérez', 'juan.perez@example.com', '$2b$10$Pw3JzGhbmQaaBCEKQFBEvuh9XHUFjtnwnIiCEOmU/LsW0eCctr8uu', 'redactor'),
('Ana López', 'ana.lopez@example.com', '$2b$10$qV9dQqNFGVux4A2LdzdN2eZX8iTUG4/oV25eLpYffO91Uegs8D/im', 'editor'),
('Carlos Ruiz', 'carlos.ruiz@example.com', '$2b$10$Cavagk2WQdjFIqET5ON7r.rZTDYBTeaNpsx3s07AQlT8qRN0Vbv6S', 'redactor'),
('María Gómez', 'maria.gomez@example.com', '$2b$10$JhfXr6aIhVhZspR0GhM9U.ySD8rhLiva4cs43aRhVYmmRdduEMIrW', 'editor'),
('Pedro Díaz', 'pedro.diaz@example.com', '$2b$10$yw./zAo3/eshWDn8y8BfA.9I8Fd8Qs5Fnou.Bp/q4x3ffN.H/3NGi', 'redactor'),
('Silvia Álvarez', 'silvia.alvarez@example.com', '$2b$10$SmVd8scHpdakJuLhV5lLou8qZIHSuGungDHkflxqyRfnrlgjUKntS', 'admin');


INSERT INTO `cms_periodico`.`categoria` (`nombre`, `slug`)
VALUES
('Tecnología', 'tecnologia'),
('Deportes', 'deportes'),
('Cine', 'cine'),
('Educación', 'educacion'),
('Economía', 'economia'),
('Arte', 'arte');


INSERT INTO `cms_periodico`.`noticias` 
(`titular`, `imagen`, `texto`, `secciones`, `fecha_publicacion`, `redactor_id`, `editor_id`, `categoria_id`, `estado`, `importancia`, `cambios`, `slug`)
VALUES
('Nueva tecnología en 2024', 'https://loremflickr.com/800/600/technology', 'Un avance en la tecnología ha sido presentado...', 'principal', '2024-11-01', 1, 2, 1, 'publicado', 85, NULL, 'nueva-tecnologia-2024'),
('Deportes extremos: tendencia global', 'https://loremflickr.com/800/600/sports', 'Los deportes extremos están ganando popularidad...', 'secundario', '2024-10-15', 3, 4, 2, 'revision', 62, NULL, 'deportes-extremos'),
('Películas más esperadas del año', 'https://loremflickr.com/800/600/cinema', 'Las películas que han generado mayor expectativa...', 'destacado', '2024-11-10', 5, 2, 3, 'publicado', 73, NULL, 'peliculas-esperadas-2024'),
('Reforma educativa en proceso', 'https://loremflickr.com/800/600/education', 'Un análisis detallado sobre los cambios propuestos...', 'principal', '2024-09-20', 1, 4, 4, 'borrador', 45, NULL, 'reforma-educativa-proceso'),
('Clima extremo afecta la economía', 'https://loremflickr.com/800/600/climate', 'Los recientes fenómenos climáticos extremos...', 'destacado', '2024-08-10', 3, 2, 5, 'publicado', 92, NULL, 'clima-extremo-economia'),
('Descubrimientos espaciales sorprendentes', 'https://loremflickr.com/800/600/space', 'Científicos han detectado un nuevo exoplaneta...', 'secundario', '2024-07-30', 5, 4, 6, 'revision', 68, NULL, 'descubrimientos-espaciales'),
('Crecimiento de startups tecnológicas', 'https://loremflickr.com/800/600/startup', 'El auge de las startups tecnológicas en 2024...', 'principal', '2024-11-12', 1, 2, 1, 'borrador', 50, NULL, 'crecimiento-startups-2024'),
('Cambio cultural en las redes sociales', 'https://loremflickr.com/800/600/social-media', 'Un análisis sobre cómo las redes sociales...', 'secundario', '2024-06-15', 3, 4, 2, 'publicado', 77, NULL, 'cambio-cultural-redes'),
('Salud mental en el trabajo', 'https://loremflickr.com/800/600/mental-health', 'La importancia de priorizar la salud mental...', 'destacado', '2024-04-25', 5, 2, 4, 'publicado', 88, NULL, 'salud-mental-trabajo'),
('Innovación en transporte público', 'https://loremflickr.com/800/600/transport', 'Nuevos avances en transporte público sostenible...', 'principal', '2024-05-10', 1, 4, 3, 'revision', 39, NULL, 'innovacion-transporte'),
('Explosión artística en 2024', 'https://loremflickr.com/800/600/art', 'Artistas emergentes están rompiendo barreras...', 'secundario', '2024-03-22', 3, 2, 6, 'borrador', 15, NULL, 'explosion-artistica-2024'),
('Política internacional en foco', 'https://loremflickr.com/800/600/politics', 'Un análisis de las recientes tensiones geopolíticas...', 'destacado', '2024-02-17', 5, 4, 5, 'publicado', 79, NULL, 'politica-internacional'),
('Economía global: proyecciones', 'https://loremflickr.com/800/600/economy', 'Expertos presentan sus proyecciones económicas...', 'principal', '2024-01-10', 1, 2, 1, 'revision', 99, NULL, 'economia-global-proyecciones'),
('Educación digital en 2024', 'https://loremflickr.com/800/600/digital-education', 'El auge de la educación en línea...', 'secundario', '2024-09-05', 3, 4, 4, 'borrador', 42, NULL, 'educacion-digital-2024'),
('Impacto ambiental de las ciudades', 'https://loremflickr.com/800/600/environment', 'Las ciudades están enfrentando retos ambientales...', 'destacado', '2024-10-01', 5, 2, 3, 'publicado', 65, NULL, 'impacto-ambiental-ciudades');
