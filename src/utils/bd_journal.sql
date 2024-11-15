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
  `rol` ENUM("editor", "redactor") NOT NULL,
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
  `slug` VARCHAR(100) NULL,
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
