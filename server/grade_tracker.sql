-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2022 at 05:32 AM
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
('COMP102', 3, 'Assignment 1', 4, '2022-11-21 11:59:59'),
('COMP102', 3, 'Assignment 2', 6, '2022-11-28 11:59:59'),
('COMP102', 3, 'Assignment 3', 6, '2022-12-05 11:59:59'),
('COMP102', 3, 'Assignment 4', 6, '2022-12-12 11:59:59'),
('COMP102', 3, 'Assignment 5', 8, '2022-12-22 11:59:59'),
('COMP102', 3, 'Final Test', 30, '2022-12-21 11:59:59'),
('COMP102', 3, 'Test 1', 10, '2022-11-25 11:59:59'),
('COMP102', 3, 'Test 2', 10, '2022-12-02 11:59:59'),
('COMP102', 3, 'Test 3', 10, '2022-12-09 11:59:59'),
('COMP102', 3, 'Test 4', 10, '2022-12-16 11:59:59'),
('COMP261', 1, 'Assignment 1', 10, '2022-03-23 11:59:59'),
('COMP261', 1, 'Assignment 2', 10, '2022-04-13 11:59:59'),
('COMP261', 1, 'Assignment 3', 10, '2022-05-11 11:59:59'),
('COMP261', 1, 'Assignment 4', 15, '2022-06-05 11:59:59'),
('COMP261', 1, 'Test 1', 25, '2022-04-29 10:00:00'),
('COMP261', 1, 'Test 2', 30, '2022-06-20 10:00:00'),
('DATA201', 2, 'Assignment 1', 10, '2022-08-05 11:59:59'),
('DATA201', 2, 'Assignment 2', 10, '2022-08-24 11:59:59'),
('DATA201', 2, 'Assignment 3', 10, '2022-09-28 11:59:59'),
('DATA201', 2, 'Assignment 4', 10, '2022-10-07 11:59:59'),
('DATA201', 2, 'Final Test', 15, '2022-12-26 09:00:00'),
('DATA201', 2, 'Mid Term Test', 15, '2022-09-07 09:00:00'),
('DATA201', 2, 'Project 1', 30, '2022-10-20 11:59:59');

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
('COMP102', 3, 'Introduction to Computer Progr'),
('COMP261', 1, 'Algorithms and Data Structures'),
('DATA201', 2, 'Techniques of Data Science ');

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
  `TotalGrade` decimal(5,2) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`Email`, `CourseCode`, `Year`, `Trimester`, `Grades`, `TotalGrade`) VALUES
('abdz2004@gmail.com', 'COMP102', 2022, 3, '9000904290009042830090427900full90429000', '90.19'),
('abdz2004@gmail.com', 'COMP261', 2022, 1, '9800full8571800095009344', '91.51'),
('abdz2004@gmail.com', 'DATA201', 2022, 2, 'full421148847750560080007500', '70.14');

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
