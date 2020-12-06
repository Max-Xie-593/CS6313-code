-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 06, 2020 at 09:57 PM
-- Server version: 5.7.24
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `boardgame_shop`
--
CREATE DATABASE IF NOT EXISTS `boardgame_shop` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `boardgame_shop`;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`user_id`) VALUES
(1);

-- --------------------------------------------------------

--
-- Table structure for table `credential`
--

DROP TABLE IF EXISTS `credential`;
CREATE TABLE `credential` (
  `username` varchar(128) NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `PASSWORD` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `credential`
--

INSERT INTO `credential` (`username`, `user_id`, `PASSWORD`) VALUES
('a', 2, '1f40fc92da241694750979ee6cf582f2d5d7d28e18335de05abc54d0560e0f5302860c652bf08d560252aa5e74210546f369fbbbce8c12cfc7957b2652fe9a75'),
('admin', 1, 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec'),
('RandomUser', 6, 'e6c83b282aeb2e022844595721cc00bbda47cb24537c1779f9bb84f04039e1676e6ba8573e588da1052510e3aa0a32a9e55879ae22b0c2d62136fc0a3e85f8bb'),
('user', 5, 'b14361404c078ffd549c03db443c3fede2f3e534d73f78f77301ed97d4a436a9fd9db05ee8b325c0ad36438b43fec8510c204fc1c1edb21d0941c00e9e2c1ce2'),
('user1', 3, 'b14361404c078ffd549c03db443c3fede2f3e534d73f78f77301ed97d4a436a9fd9db05ee8b325c0ad36438b43fec8510c204fc1c1edb21d0941c00e9e2c1ce2'),
('user3', 4, '8ac4145c8e388ddfe3cd94886f026260d917cab07903c533f3a26945019bc4a50e6f23f266acbb0cbae89130fa3242c9a5145e4218c3ef1deebccb58d1a64a43');

-- --------------------------------------------------------

--
-- Table structure for table `item_purchase`
--

DROP TABLE IF EXISTS `item_purchase`;
CREATE TABLE `item_purchase` (
  `product_id` int(10) UNSIGNED NOT NULL,
  `purchase_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL,
  `cents_price` int(10) UNSIGNED NOT NULL COMMENT 'The price in US cents for each item when the item was purchased.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `item_purchase`
--

INSERT INTO `item_purchase` (`product_id`, `purchase_id`, `quantity`, `cents_price`) VALUES
(1, 1, 1, 4949),
(1, 3, 1, 4949),
(1, 4, 1, 4949),
(2, 2, 1, 1349),
(2, 3, 1, 1349),
(2, 4, 1, 1349),
(2, 7, 2, 1349),
(3, 3, 1, 9449),
(3, 4, 1, 9449),
(4, 5, 1, 1799),
(4, 7, 3, 1799),
(5, 5, 2, 1849),
(6, 6, 1, 899),
(7, 3, 1, 995),
(7, 5, 1, 995),
(7, 6, 1, 995),
(7, 7, 1, 995),
(10, 6, 2, 788);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `cents_price` int(11) UNSIGNED NOT NULL COMMENT 'The current price of the item in US cents.',
  `image_path` text NOT NULL,
  `description` text NOT NULL,
  `genre` varchar(20) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `cents_price`, `image_path`, `description`, `genre`, `is_deleted`) VALUES
(1, 'Catan2', 4999, 'catan.jpg', 'Roads!', 'strategy', 1),
(2, 'Battleship', 1349, 'battleship.jpg', 'A strategy type guessing game for two players.', 'strategy', 0),
(3, 'Chess', 9449, 'chess.jpg', 'A board game for two players.', 'strategy', 0),
(4, 'Clue', 1799, 'clue.jpg', 'A murder mystery game for three to six players', 'strategy', 0),
(5, 'Monopoly', 1849, 'monopoly.jpg', 'Players collect rent from their opponents, with the goal being to drive them into bankruptcy.', 'family', 0),
(6, 'Sorry', 899, 'sorry.jpg', 'players draw cards and try to advance themselves.', 'family', 0),
(7, 'Dungeon Mayhem', 995, 'dnd_dungeon_mayhem.jpg', 'A quick playing card game set in the Dungeons and Dragons universe.', 'roleplay', 0),
(8, 'Dungeon Mayhem Battle for Baldurs Gate', 795, 'dnd_dungeon_mayhem_battle_for_baldurs_gate.jpg', 'The first expansion for the wildly popular easy-to-learn, family-friendly card game Dungeon Mayhem.', 'roleplay', 0),
(9, 'Catan Extension', 3129, 'catan_extension.jpg', 'This extension requires Catan to play. Allows for 1 - 2 more players to play', 'strategy', 0),
(10, 'Connect 4', 788, 'connect4.jpg', 'A tic-tac-toe-like two-player game in which players try to connect 4 tokens in a line.', 'family', 0),
(11, 'Coup', 1129, 'coup.jpg', 'You are head of a family in an Italian city-state, a city run by a weak and corrupt court. You need to manipulate, bluff and bribe your way to power.', 'strategy', 0),
(12, 'Dungeon Mayhem: Monster Madness', 3500, 'dnd_dungeon_mayhem_monster_madness.jpg', 'You play as one of six epic D&D monsters, each with their own way to charm, crush, disintegrate, and devour their foes.', 'roleplay', 0),
(13, 'DnD Dungeon Masters Guide', 2999, 'dnd_dungon_masters_guide.jpg', 'Contains rules concerning the arbitration and administration of a DnD game.', 'roleplay', 0),
(14, 'DnD Moster Manuel', 2999, 'dnd_monster_manual.jpg', 'Contains additional and monsters for running a DnD game.', 'roleplay', 0),
(15, 'DnD Players Handbook', 2999, 'dnd_players_handbook.jpg', 'Information over rules and characters for players of DnD.', 'roleplay', 0),
(16, 'Life', 1399, 'life.jpg', 'The game simulates a persons travels through his or her life, from college to retirement, with jobs, marriage, and possible children along the way.', 'family', 0),
(17, 'Scrabble', 2799, 'scrabble.jpg', 'Scrabble is a word game in which two to four players score points by placing tiles.', 'strategy', 0),
(18, 'Taboo', 1977, 'taboo.jpg', 'The objective of the game is for a player to have their partners guess the word on the players card without using the word itself or five additional words listed on the card.', 'strategy', 0),
(19, 'Catan', 4999, 'catan.jpg', 'An award-winning strategy game where players collect resources and use them to build roads, settlements and cities on their way to victory.', 'strategy', 0);

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
CREATE TABLE `purchase` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `purchase_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `purchase`
--

INSERT INTO `purchase` (`id`, `user_id`, `purchase_date`) VALUES
(1, 1, '2020-12-05 17:52:49'),
(2, 1, '2020-12-05 19:38:57'),
(3, 1, '2020-12-05 20:40:04'),
(4, 1, '2020-12-05 22:02:27'),
(5, 1, '2020-12-05 22:58:56'),
(6, 1, '2020-12-06 00:34:20'),
(7, 1, '2020-12-06 00:46:12');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(10) NOT NULL,
  `last_name` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`) VALUES
(1, 'admin', 'admin'),
(2, 'a', 'a'),
(3, 'user', 'user'),
(4, 'user3', 'user3'),
(5, 'user', 'user'),
(6, 'Random', 'User');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `credential`
--
ALTER TABLE `credential`
  ADD PRIMARY KEY (`username`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `item_purchase`
--
ALTER TABLE `item_purchase`
  ADD PRIMARY KEY (`product_id`,`purchase_id`),
  ADD KEY `purchase_id` (`purchase_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `credential`
--
ALTER TABLE `credential`
  ADD CONSTRAINT `credential_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `item_purchase`
--
ALTER TABLE `item_purchase`
  ADD CONSTRAINT `item_purchase_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `item_purchase_ibfk_2` FOREIGN KEY (`purchase_id`) REFERENCES `purchase` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
