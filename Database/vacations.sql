CREATE DATABASE  IF NOT EXISTS `vacations` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vacations`;
-- MySQL dump 10.13  Distrib 8.0.46, for macos15 (arm64)
--
-- Host: localhost    Database: vacations
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `userId` int NOT NULL,
  `vacationId` int NOT NULL,
  PRIMARY KEY (`userId`,`vacationId`),
  KEY `vacationId` (`vacationId`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`vacationId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (1,2),(5,2),(1,3),(5,3),(1,4),(5,4),(5,7),(1,9),(5,11),(5,17);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `roleId` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(20) NOT NULL,
  PRIMARY KEY (`roleId`),
  UNIQUE KEY `roleName` (`roleName`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (2,'Admin'),(1,'User');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Omri','Cohen','omri@test.com','466cfef59b93225ba7a61018f7c6f2bcb59de4aa5c58f3d688172ef8819e9a131af18b5c8434a403c61d1d370eae5628f661f490725e5b4c9b85651ca0f4f683',1),(2,'Admin','User','admin@vacations.com','466cfef59b93225ba7a61018f7c6f2bcb59de4aa5c58f3d688172ef8819e9a131af18b5c8434a403c61d1d370eae5628f661f490725e5b4c9b85651ca0f4f683',2),(3,'omri','cohen','omri1@test.com','466cfef59b93225ba7a61018f7c6f2bcb59de4aa5c58f3d688172ef8819e9a131af18b5c8434a403c61d1d370eae5628f661f490725e5b4c9b85651ca0f4f683',1),(4,'2d2','d2d','d@d.com','466cfef59b93225ba7a61018f7c6f2bcb59de4aa5c58f3d688172ef8819e9a131af18b5c8434a403c61d1d370eae5628f661f490725e5b4c9b85651ca0f4f683',1),(5,'Amit','Cohen','amit@test.com','466cfef59b93225ba7a61018f7c6f2bcb59de4aa5c58f3d688172ef8819e9a131af18b5c8434a403c61d1d370eae5628f661f490725e5b4c9b85651ca0f4f683',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `vacationId` int NOT NULL AUTO_INCREMENT,
  `destination` varchar(100) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `imageName` varchar(255) NOT NULL,
  PRIMARY KEY (`vacationId`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (1,'Rome','Discover the history, food and culture of Rome. Visit the Colosseum, Vatican City, Trevi Fountain and enjoy authentic Italian cuisine.','2026-08-25','2026-09-05',1250.00,'rome.jpg'),(2,'Paris','Enjoy a romantic vacation in Paris including the Eiffel Tower, Louvre Museum, Seine River and the beautiful streets of the French capital.','2026-08-20','2026-09-03',1450.00,'paris.jpg'),(3,'London','Explore London and visit famous attractions including Big Ben, Buckingham Palace, Tower Bridge and the British Museum.','2026-07-10','2026-07-17',1350.00,'london.jpg'),(4,'Barcelona','Experience Barcelona with its beaches, nightlife, famous architecture and attractions including Sagrada Familia and Park Guell.','2026-06-15','2026-06-22',1200.00,'barcelona.jpg'),(5,'Amsterdam','Explore the canals of Amsterdam, visit museums, enjoy local food and discover one of Europe\'s most unique cities.','2026-12-01','2026-12-06',1150.00,'amsterdam.jpg'),(6,'Prague','Discover the historic city of Prague including Prague Castle, Charles Bridge, Old Town Square and traditional Czech cuisine.','2026-12-12','2026-12-17',950.00,'prague.jpg'),(7,'Tokyo','Experience Tokyo with its combination of modern technology, traditional culture, incredible food, shopping and famous landmarks.','2027-01-10','2027-01-18',2450.00,'tokyo.jpg'),(8,'New York','Visit New York City and explore Times Square, Central Park, the Statue of Liberty, Broadway and the famous Manhattan skyline.','2027-02-02','2027-02-09',2200.00,'new-york.jpg'),(9,'Athens','Explore ancient Greece in Athens including the Acropolis, Parthenon, Plaka neighborhood and traditional Greek restaurants.','2027-03-05','2027-03-10',1050.00,'athens.jpg'),(10,'Lisbon','Discover Lisbon with its colorful streets, historic neighborhoods, local food, viewpoints and nearby Atlantic coastline.','2027-03-20','2027-03-26',1100.00,'lisbon.jpg'),(11,'Budapest','Enjoy Budapest and visit Buda Castle, the Parliament building, thermal baths and the beautiful Danube River.','2027-04-08','2027-04-13',900.00,'budapest.jpg'),(12,'Dubai','Experience Dubai with luxury hotels, modern architecture, desert activities, shopping and attractions including Burj Khalifa.','2027-05-01','2027-05-07',1950.00,'dubai.jpg'),(13,'Berlin','Explore Berlin and discover its history, museums, nightlife, restaurants and famous landmarks including the Brandenburg Gate.','2027-05-18','2027-05-24',1150.00,'berlin.jpg'),(14,'Vienna','Visit Vienna and enjoy elegant architecture, classical music, traditional cafes, palaces and the historic city center.','2027-06-02','2027-06-08',1250.00,'vienna.jpg'),(15,'Madrid','Experience Madrid with its museums, football culture, nightlife, local food, parks and famous city squares.','2027-06-15','2027-06-21',1200.00,'madrid.jpg'),(16,'Florence','Discover Florence and explore Renaissance art, beautiful architecture, local Italian food and the historic streets of Tuscany.','2027-07-03','2027-07-09',1350.00,'florence.jpg'),(17,'Venice','Enjoy a unique vacation in Venice including canals, gondola rides, historic squares, local restaurants and beautiful architecture.','2027-07-18','2027-07-23',1400.00,'venice.jpg'),(18,'Copenhagen','Explore Copenhagen with its colorful harbor, modern design, cycling culture, local food and famous attractions.','2027-08-01','2027-08-07',1450.00,'copenhagen.jpg'),(19,'Reykjavik','Visit Iceland and explore Reykjavik, waterfalls, volcanic landscapes, geothermal pools and the famous Golden Circle.','2027-08-20','2027-08-27',2100.00,'reykjavik.jpg'),(20,'Bangkok','Experience Bangkok with vibrant street markets, temples, local Thai food, shopping centers and exciting nightlife.','2027-09-05','2027-09-12',1650.00,'bangkok.jpg'),(21,'Singapore','Discover Singapore with modern architecture, beautiful gardens, multicultural food, shopping and famous city attractions.','2027-09-18','2027-09-24',1850.00,'singapore.jpg'),(22,'Los Angeles','Visit Los Angeles and explore Hollywood, Santa Monica, Venice Beach, Beverly Hills and Southern California attractions.','2027-10-04','2027-10-11',2300.00,'los-angeles.jpg'),(23,'Miami','Enjoy Miami with sunny beaches, nightlife, shopping, Art Deco architecture and the tropical atmosphere of South Florida.','2027-10-20','2027-10-27',2150.00,'miami.jpg'),(24,'Sydney','Travel to Sydney and visit the Opera House, Harbour Bridge, famous beaches, local neighborhoods and beautiful Australian coastline.','2027-11-08','2027-11-16',2850.00,'sydney.jpg'),(26,'Tel Aviv',' the Mediterranean coast. Established in 1909 as a modern suburb of ancient Jaffa, it is now a bustling metropolis known for its non-stop energy','2026-09-20','2026-09-26',650.00,'c7b3474f-c496-40d9-ac37-7d65101aa630.jpeg'),(27,'Kyoto, Japan','Discover Kyoto ancient temples, traditional Japanese gardens, beautiful shrines and historic streets. Enjoy authentic Japanese cuisine and local culture.','2026-10-10','2026-10-20',2450.00,'tokyo.jpg'),(28,'Santorini, Greece','Enjoy breathtaking views of the Aegean Sea, beautiful whitewashed villages, spectacular sunsets and traditional Greek restaurants.','2026-10-12','2026-10-19',1890.00,'athens.jpg'),(29,'Barcelona, Spain','Explore Barcelona stunning architecture, Mediterranean beaches, vibrant streets and famous landmarks including Sagrada Familia.','2026-10-11','2026-10-18',1350.00,'barcelona.jpg');
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'vacations'
--

--
-- Dumping routines for database 'vacations'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-13 13:20:51
