-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: canteen_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `icon` varchar(50) DEFAULT 'fa-utensils',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Chinese','fa-bowl-rice'),(2,'Pizza','fa-pizza-slice'),(3,'Kathi Rolls','fa-scroll'),(4,'Maggi','fa-bacon'),(5,'Sandwiches','fa-bread-slice'),(6,'Indian Combos','fa-bowl-food'),(7,'Biryani','fa-fire');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `item_id` int NOT NULL,
  `stock_qty` int DEFAULT '50',
  PRIMARY KEY (`item_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,100),(2,100),(3,100),(4,100),(5,100),(6,100),(7,100),(8,100),(9,100),(10,100),(11,100),(12,100),(13,100),(14,100),(15,100),(16,100),(17,100),(18,100),(19,100),(20,100),(21,100),(22,100),(23,100),(24,100),(25,100),(26,100),(27,100);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category_id` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `prep_time_mins` int DEFAULT NULL,
  `calories` int DEFAULT NULL,
  `is_veg` tinyint(1) DEFAULT '1',
  `spicy_level` int DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (1,'Vegetable Chowmein',70.00,1,'/public/images/veg-chowmein.jpg',10,250,1,1),(2,'Egg Chowmein',80.00,1,'/public/images/egg-chowmein.jpg',12,300,0,1),(3,'Chicken Chowmein',90.00,1,'/public/images/chicken-chowmein.jpg',15,350,0,2),(4,'Vegetable Fried Rice',70.00,1,'/public/images/veg-fried-rice.jpg',10,280,1,1),(5,'Chicken Fried Rice',90.00,1,'/public/images/chicken-fried-rice.jpg',15,380,0,2),(6,'Paneer Chilly Dry (8 Pcs)',150.00,1,'/public/images/paneer-chilly-dry.jpg',20,400,1,3),(7,'Chicken Chilly Dry (8 Pcs)',175.00,1,'/public/images/chicken-chilly-dry.jpg',25,450,0,3),(8,'Mexican Pizza',100.00,2,'/public/images/mexican-pizza.jpg',20,500,1,2),(9,'Masala Paneer Pizza',120.00,2,'/public/images/masala-paneer-pizza.jpg',20,550,1,2),(10,'Chicken Fry Pizza',125.00,2,'/public/images/chicken-paneer-pizza.jpg',25,600,0,2),(11,'Cheese Pizza',90.00,2,'/public/images/cheese-pizza.jpg',15,450,1,0),(12,'Veg Kathi Roll',35.00,3,'/public/images/veg-roll.jpg',8,200,1,1),(13,'Aloo Kathi Roll',40.00,3,'/public/images/aloo-roll.jpg',8,220,1,1),(14,'Egg Kathi Roll',40.00,3,'/public/images/egg-roll.jpg',8,250,0,1),(15,'Chicken Kathi Roll',60.00,3,'/public/images/chicken-roll.jpg',10,300,0,2),(16,'Plain Maggi',28.00,4,'/public/images/plain-maggi.jpg',5,180,1,0),(17,'Masala Fry Maggi',35.00,4,'/public/images/masala-maggi.jpg',7,220,1,2),(18,'Maggi with Egg',43.00,4,'/public/images/egg-maggi.jpg',7,260,0,1),(19,'Veg Plain Sandwich',25.00,5,'/public/images/veg-plain-sandwich.jpg',5,150,1,0),(20,'Veg Grill Sandwich',35.00,5,'/public/images/veg-grill-sandwich.jpg',8,200,1,1),(21,'Paneer Grill Sandwich',60.00,5,'/public/images/paneer-grill-sandwich.jpg',10,280,1,1),(22,'Chicken Grill Sandwich',70.00,5,'/public/images/chicken-grill-sandwich.jpg',12,320,0,1),(23,'Paneer Butter Masala (5 Pcs)',125.00,6,'/public/images/paneer-butter-masala.jpg',15,600,1,1),(24,'Chicken Butter Masala (2 Pcs)',150.00,6,'/public/images/chicken-butter-masala.jpg',20,700,0,2),(25,'Chicken Curry (Home Style)',125.00,6,'/public/images/chicken-curry.jpg',20,650,0,3),(26,'Veg Biryani',130.00,7,'/public/images/veg-biryani.jpg',25,550,1,2),(27,'Chicken Biryani',150.00,7,'/public/images/chicken-biryani.jpg',30,650,0,3);
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `menu_item_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price_at_time` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `menu_item_id` (`menu_item_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` enum('new','cooking','ready','completed') DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,70.00,'new','2025-12-09 22:01:38'),(2,1,160.00,'new','2025-12-09 22:01:56');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `wallet_balance` decimal(10,2) DEFAULT '500.00',
  `is_admin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'student',1500.00,0),(2,'admin',0.00,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-10  4:51:35
