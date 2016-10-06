-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-10-2016 a las 19:25:50
-- Versión del servidor: 10.1.13-MariaDB
-- Versión de PHP: 7.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `reservations_offices`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comments`
--

CREATE TABLE `comments` (
  `ID` int(11) NOT NULL,
  `RESERVATION_ID` int(11) NOT NULL,
  `TEXT` text COLLATE utf8_unicode_ci NOT NULL,
  `CREATION_TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CREATION_USER` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservations`
--

CREATE TABLE `reservations` (
  `ID` int(11) NOT NULL,
  `CREATION_TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `EDITION_TIMESTAMP` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `TITLE` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `DESCRIPTION` varchar(350) COLLATE utf8_unicode_ci DEFAULT NULL,
  `BODY` text COLLATE utf8_unicode_ci,
  `SPACE` int(11) NOT NULL,
  `DATE` date NOT NULL,
  `FROM_TIME` int(11) NOT NULL,
  `TO_TIME` int(11) NOT NULL,
  `CREATION_USER` int(11) NOT NULL,
  `EDITION_USER` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `spaces`
--

CREATE TABLE `spaces` (
  `ID` int(11) NOT NULL,
  `TEXT` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `CREATION_TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CREATION_USER` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `spaces`
--

INSERT INTO `spaces` (`ID`, `TEXT`, `CREATION_TIMESTAMP`, `CREATION_USER`) VALUES
(1, 'MARIO ROOM', '2016-10-06 17:23:30', 1),
(2, 'SONIC ROOM', '2016-10-06 17:23:30', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `ID` int(11) NOT NULL,
  `TEXT` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `CREATION_TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CREATION_USER` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `tags`
--

INSERT INTO `tags` (`ID`, `TEXT`, `CREATION_TIMESTAMP`, `CREATION_USER`) VALUES
(4, 'MEETING', '2016-10-06 13:31:20', 1),
(5, 'TRAINING', '2016-10-06 13:31:20', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag_lists`
--

CREATE TABLE `tag_lists` (
  `ID` int(11) NOT NULL,
  `RESERVATION_ID` int(11) NOT NULL,
  `TAG_ID` int(11) NOT NULL,
  `CREATION_USER` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `USERNAME` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `PASSWORD` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `FIRST_NAME` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `LAST_NAME` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `EMAIL` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `FLOOR` tinyint(4) NOT NULL,
  `DEPARTMENT` tinyint(4) NOT NULL,
  `ROLE` int(11) NOT NULL,
  `CREATION_TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`ID`, `USERNAME`, `PASSWORD`, `FIRST_NAME`, `LAST_NAME`, `EMAIL`, `FLOOR`, `DEPARTMENT`, `ROLE`, `CREATION_TIMESTAMP`) VALUES
(1, 'dgeslin', '5f4dcc3b5aa765d61d8327deb882cf99', 'Daniel', 'Geslin', 'danielisaacgeslin@gmail.com', 4, 2, 1, '2016-08-31 15:14:25'),
(2, 'tester', '5f4dcc3b5aa765d61d8327deb882cf99', 'Tester', 'Simpson', 'tester@simpson.com', 6, 3, 2, '2016-09-14 13:43:30');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`),
  ADD KEY `ID_2` (`ID`),
  ADD KEY `CREATION_USER` (`CREATION_USER`),
  ADD KEY `ARTICLE_ID` (`RESERVATION_ID`),
  ADD KEY `ARTICLE_ID_2` (`RESERVATION_ID`),
  ADD KEY `CREATION_USER_2` (`CREATION_USER`);

--
-- Indices de la tabla `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`),
  ADD KEY `CREATION_USER` (`CREATION_USER`),
  ADD KEY `EDITION_USER` (`EDITION_USER`),
  ADD KEY `CREATION_USER_2` (`CREATION_USER`),
  ADD KEY `CREATION_USER_3` (`CREATION_USER`),
  ADD KEY `CREATION_USER_4` (`CREATION_USER`),
  ADD KEY `EDITION_USER_2` (`EDITION_USER`),
  ADD KEY `SPACE` (`SPACE`);

--
-- Indices de la tabla `spaces`
--
ALTER TABLE `spaces`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `TEXT` (`TEXT`),
  ADD KEY `CREATION_USER` (`CREATION_USER`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `TEXT` (`TEXT`),
  ADD KEY `CREATION_USER` (`CREATION_USER`),
  ADD KEY `CREATION_USER_2` (`CREATION_USER`);

--
-- Indices de la tabla `tag_lists`
--
ALTER TABLE `tag_lists`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `TAG_ID` (`TAG_ID`),
  ADD KEY `ARTICLE_ID` (`RESERVATION_ID`),
  ADD KEY `ARTICLE_ID_2` (`RESERVATION_ID`),
  ADD KEY `TAG_ID_2` (`TAG_ID`),
  ADD KEY `CREATION_USER` (`CREATION_USER`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comments`
--
ALTER TABLE `comments`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;
--
-- AUTO_INCREMENT de la tabla `reservations`
--
ALTER TABLE `reservations`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;
--
-- AUTO_INCREMENT de la tabla `spaces`
--
ALTER TABLE `spaces`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `tag_lists`
--
ALTER TABLE `tag_lists`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `COMMENTS_ibfk_1` FOREIGN KEY (`RESERVATION_ID`) REFERENCES `reservations` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `COMMENTS_ibfk_2` FOREIGN KEY (`CREATION_USER`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `RESERVATIONS_ibfk_1` FOREIGN KEY (`CREATION_USER`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `RESERVATIONS_ibfk_2` FOREIGN KEY (`EDITION_USER`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `spaces`
--
ALTER TABLE `spaces`
  ADD CONSTRAINT `spaces_ibfk_1` FOREIGN KEY (`CREATION_USER`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tags`
--
ALTER TABLE `tags`
  ADD CONSTRAINT `TAGS_ibfk_1` FOREIGN KEY (`CREATION_USER`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tag_lists`
--
ALTER TABLE `tag_lists`
  ADD CONSTRAINT `TAG_LISTS_ibfk_1` FOREIGN KEY (`RESERVATION_ID`) REFERENCES `reservations` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `TAG_LISTS_ibfk_2` FOREIGN KEY (`TAG_ID`) REFERENCES `tags` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
