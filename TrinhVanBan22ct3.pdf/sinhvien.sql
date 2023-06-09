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
-- Table structure for table `sinhvien`
--

CREATE TABLE `sinhvien` (
  `MaSV` int(11) NOT NULL,
  `TenSV` varchar(50) NOT NULL,
  `TuoiSV` int(2) NOT NULL,
  `GioiTinh` varchar(3) NOT NULL,
  `ChuyenNganh` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sinhvien`
--

INSERT INTO `sinhvien` (`MaSV`, `TenSV`, `TuoiSV`, `GioiTinh`, `ChuyenNganh`) VALUES
(123456, 'Trịnh Văn Ban', 19, 'Nam', 'Công nghệ Thông Tin'),
(132456, 'Lê Phú', 20, 'nam', 'Kinh tế'),
(142356, 'Ngô Minh Hiếu', 20, 'nam', 'Ngoại Ngữ'),
(152346, 'Hiếu Thứ Hai', 21, 'nam', 'Quản trị kinh doanh'),
(162345, 'Ngô Ngọc Thảo', 19, 'nữ', 'Luật');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sinhvien`
--
ALTER TABLE `sinhvien`
  ADD PRIMARY KEY (`MaSV`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sinhvien`
--
ALTER TABLE `sinhvien`
  MODIFY `MaSV` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=162346;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
