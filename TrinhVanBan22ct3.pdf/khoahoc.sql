-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2023 at 06:47 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sinhvien22ct3`
--

-- --------------------------------------------------------

--
-- Table structure for table `khoahoc`
--

CREATE TABLE `khoahoc` (
  `MaSV` int(11) NOT NULL,
  `Makhoahoc` int(11) NOT NULL,
  `Tenkhoahoc` varchar(255) NOT NULL,
  `Sotinchi` int(2) NOT NULL,
  `Magiangvien` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `khoahoc`
--

INSERT INTO `khoahoc` (`MaSV`, `Makhoahoc`, `Tenkhoahoc`, `Sotinchi`, `Magiangvien`) VALUES
(123456, 654321, 'Lập trình C++', 3, 1123456),
(132456, 645321, 'Kinh tế học', 4, 1132456),
(142356, 634521, 'Tiếng anh giao tiếp', 2, 1142356),
(152346, 623451, 'Quan lý dự án', 2, 1154326),
(162345, 612345, 'Luật hành chính', 3, 1165432);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `khoahoc`
--
ALTER TABLE `khoahoc`
  ADD PRIMARY KEY (`MaSV`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `khoahoc`
--
ALTER TABLE `khoahoc`
  MODIFY `MaSV` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165433;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `khoahoc`
--
ALTER TABLE `khoahoc`
  ADD CONSTRAINT `khoahoc_ibfk_1` FOREIGN KEY (`MaSV`) REFERENCES `sinhvien` (`MaSV`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
