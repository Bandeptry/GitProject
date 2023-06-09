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
-- Table structure for table `giangvien`
--

CREATE TABLE `giangvien` (
  `Magiangvien` int(11) NOT NULL,
  `MaSV` int(11) NOT NULL,
  `TenGV` varchar(20) NOT NULL,
  `TuoiGV` int(2) NOT NULL,
  `GioiTinh` varchar(3) NOT NULL,
  `Chuyennganh` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `giangvien`
--

INSERT INTO `giangvien` (`Magiangvien`, `MaSV`, `TenGV`, `TuoiGV`, `GioiTinh`, `Chuyennganh`) VALUES
(1142356, 123456, 'Phạm Thị Dung', 35, 'nữ', 'Công nghệ thông tin'),
(1132456, 132456, 'Nguyễn Duy Khương', 40, 'nam', 'Kinh tế'),
(1142356, 142356, 'Nguyễn Phước Thịnh', 37, 'nam', 'Ngoại ngữ'),
(1154326, 152346, 'Nguyễn Văn Linh', 42, 'nam', 'Quản trị kinh doanh'),
(1165432, 162345, 'Nguyễn Thị Trang', 45, 'nữ', 'Luật');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `giangvien`
--
ALTER TABLE `giangvien`
  ADD PRIMARY KEY (`MaSV`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `giangvien`
--
ALTER TABLE `giangvien`
  MODIFY `MaSV` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1165433;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `giangvien`
--
ALTER TABLE `giangvien`
  ADD CONSTRAINT `giangvien_ibfk_1` FOREIGN KEY (`MaSV`) REFERENCES `sinhvien` (`MaSV`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
