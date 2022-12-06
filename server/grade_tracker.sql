-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2022 at 04:36 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `grade_tracker`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `CourseCode` char(7) NOT NULL,
  `Trimester` tinyint(4) NOT NULL,
  `AssignmentName` varchar(30) NOT NULL,
  `Weight` tinyint(4) NOT NULL,
  `DueDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`CourseCode`, `Trimester`, `AssignmentName`, `Weight`, `DueDate`) VALUES
('COMP103', 3, 'Close Da PC', 75, '2022-11-11 13:59:21'),
('COMP103', 3, 'Open Da PC', 25, '2022-11-01 13:58:55'),
('COMP261', 1, 'Make a computer', 50, '2022-11-15 05:11:31'),
('CSFF101', 3, 'Computer Stuff', 100, '2022-12-06 15:49:00'),
('TEM361', 3, 'ffe', 50, '2022-11-21 22:08:00'),
('TEM361', 3, 'YOOO', 50, '2022-11-04 22:08:00');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `CourseCode` char(7) NOT NULL,
  `TrimesterTaught` tinyint(3) UNSIGNED NOT NULL,
  `CourseName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`CourseCode`, `TrimesterTaught`, `CourseName`) VALUES
('COMP103', 1, 'Testing'),
('COMP103', 3, 'Computers Are Easy ASF'),
('COMP261', 1, 'HELLO I AM NAME OF COURSE'),
('CSFF101', 3, 'Computer Stuff'),
('TEM361', 3, 'Temp Thing');

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `Email` varchar(256) NOT NULL,
  `CourseCode` char(7) NOT NULL,
  `Year` year(4) NOT NULL,
  `Trimester` tinyint(4) NOT NULL,
  `Grades` varchar(100) NOT NULL,
  `TotalGrade` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`Email`, `CourseCode`, `Year`, `Trimester`, `Grades`, `TotalGrade`) VALUES
('abdz2004@gmail.com', 'COMP103', 2022, 3, 'nullnull', 0),
('abdz2004@gmail.com', 'COMP261', 2022, 2, '56850000null8000', 0),
('abdz2004@gmail.com', 'CSFF101', 2022, 3, 'null', 0),
('abdz2004@gmail.com', 'TEM361', 2022, 3, 'nullnull', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Email` varchar(256) NOT NULL,
  `Password` char(128) NOT NULL,
  `Salt` char(32) NOT NULL,
  `DisplayName` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Email`, `Password`, `Salt`, `DisplayName`) VALUES
('abdz2004@gmail.com', '278b86fc39f89cfab15dfb76d240b2b1e97cddca72ffef23c087dd8077d510a4bd8f95d93e0a720b3b40eca1762f87be0b8032df33c989ccbedf096c2bfd03cb', 'f6c8e7e401fce735447ba985d3f63af2', 'ABOOBIES');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`CourseCode`,`AssignmentName`,`Trimester`) USING BTREE,
  ADD KEY `CourseCode` (`CourseCode`),
  ADD KEY `Trimester` (`Trimester`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`CourseCode`,`TrimesterTaught`);

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`Email`,`CourseCode`,`Year`,`Trimester`),
  ADD KEY `CourseCode` (`CourseCode`),
  ADD KEY `Email` (`Email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`CourseCode`) REFERENCES `courses` (`CourseCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`Email`) REFERENCES `users` (`Email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`CourseCode`) REFERENCES `courses` (`CourseCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
