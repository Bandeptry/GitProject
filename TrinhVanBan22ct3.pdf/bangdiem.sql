-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2023 at 06:46 AM
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
-- Table structure for table `bangdiem`
--

CREATE TABLE `bangdiem` (
  `MaSV` int(11) NOT NULL,
  `Makhoahoc` int(15) NOT NULL,
  `Diem` float NOT NULL,
  `Hocky` varchar(25) NOT NULL,
  `Namhoc` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `bangdiem`
--

INSERT INTO `bangdiem` (`MaSV`, `Makhoahoc`, `Diem`, `Hocky`, `Namhoc`) VALUES
(123456, 654321, 9.5, 'Học kỳ 2', 2023),
(132456, 645326, 8.5, 'Học kỳ 2', 2023),
(142356, 634521, 9, 'Học kỳ 2', 2022),
(152346, 645321, 7.5, 'Học kỳ 1', 2023),
(162345, 612345, 8, 'Học kì 1', 2023);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bangdiem`
--
ALTER TABLE `bangdiem`
  ADD PRIMARY KEY (`MaSV`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bangdiem`
--
ALTER TABLE `bangdiem`
  MODIFY `MaSV` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=162346;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bangdiem`
--
ALTER TABLE `bangdiem`
  ADD CONSTRAINT `bangdiem_ibfk_1` FOREIGN KEY (`MaSV`) REFERENCES `sinhvien` (`MaSV`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
