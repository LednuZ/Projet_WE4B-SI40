-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 20 juin 2026 à 13:24
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `automarket`
--

-- --------------------------------------------------------

--
-- Structure de la table `annonce`
--

CREATE TABLE `annonce` (
  `id_annonce` int(10) UNSIGNED NOT NULL,
  `id_utilisateur` int(10) UNSIGNED NOT NULL,
  `id_version` int(10) UNSIGNED NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  `annee_circulation` year(4) NOT NULL,
  `kilometrage` int(10) UNSIGNED NOT NULL,
  `etat` varchar(50) DEFAULT NULL,
  `couleur` varchar(50) DEFAULT NULL,
  `sellerie` varchar(100) DEFAULT NULL,
  `finition` varchar(100) DEFAULT NULL,
  `nombre_proprietaire` tinyint(4) DEFAULT NULL,
  `premiere_main` tinyint(1) NOT NULL DEFAULT 0,
  `controle_technique` date DEFAULT NULL,
  `provenance` varchar(100) DEFAULT NULL,
  `localisation` varchar(150) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `statut` varchar(20) NOT NULL DEFAULT 'active',
  `date_publication` datetime DEFAULT NULL,
  `date_creation` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modification` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date_vente` datetime DEFAULT NULL,
  `commentaire_admin` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `annonce`
--

INSERT INTO `annonce` (`id_annonce`, `id_utilisateur`, `id_version`, `prix`, `annee_circulation`, `kilometrage`, `etat`, `couleur`, `sellerie`, `finition`, `nombre_proprietaire`, `premiere_main`, `controle_technique`, `provenance`, `localisation`, `description`, `statut`, `date_publication`, `date_creation`, `date_modification`, `date_vente`, `commentaire_admin`) VALUES
(1, 14, 11, 15466.00, '2020', 12300, 'Bon', 'Blanche', NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'active', '2026-06-16 22:29:03', '2026-06-16 22:29:03', '2026-06-16 22:29:03', NULL, NULL),
(2, 14, 9, 2.00, '1999', 4294967295, 'Excellent', 'Noir', 'Noir', 'M', 121, 0, NULL, 'Zimbabwe', 'Mulhouse', 'Voiture en très bonne état', 'vendu', '2026-06-19 13:45:08', '2026-06-19 13:45:08', '2026-06-19 13:48:58', '2026-06-19 13:48:58', NULL),
(3, 18, 90, 32000.00, '2023', 12000, 'Très bon', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'vendu', '2026-06-20 12:07:19', '2026-06-20 12:07:19', '2026-06-20 12:07:55', '2026-06-20 12:07:55', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `avis_modele`
--

CREATE TABLE `avis_modele` (
  `id_avis_modele` int(10) UNSIGNED NOT NULL,
  `id_redacteur` int(10) UNSIGNED NOT NULL,
  `id_modele` int(10) UNSIGNED NOT NULL,
  `note` tinyint(4) NOT NULL,
  `contenu` text DEFAULT NULL,
  `date_avis` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `avis_modele`
--

INSERT INTO `avis_modele` (`id_avis_modele`, `id_redacteur`, `id_modele`, `note`, `contenu`, `date_avis`) VALUES
(1, 14, 11, 5, 'Bon modèle fiable', '2026-06-18 18:20:49');

-- --------------------------------------------------------

--
-- Structure de la table `avis_utilisateur`
--

CREATE TABLE `avis_utilisateur` (
  `id_avis_utilisateur` int(10) UNSIGNED NOT NULL,
  `id_redacteur` int(10) UNSIGNED NOT NULL,
  `id_vendeur` int(10) UNSIGNED NOT NULL,
  `note` tinyint(4) NOT NULL,
  `contenu` text DEFAULT NULL,
  `date_avis` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `avis_utilisateur`
--

INSERT INTO `avis_utilisateur` (`id_avis_utilisateur`, `id_redacteur`, `id_vendeur`, `note`, `contenu`, `date_avis`) VALUES
(1, 13, 14, 5, 'Vendeur honnête', '2026-06-18 18:21:48'),
(2, 17, 14, 1, 'ne voulait pas me vendre sa voiture', '2026-06-19 20:36:04');

-- --------------------------------------------------------

--
-- Structure de la table `coffre`
--

CREATE TABLE `coffre` (
  `id_coffre` int(10) UNSIGNED NOT NULL,
  `volume` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `coffre`
--

INSERT INTO `coffre` (`id_coffre`, `volume`) VALUES
(1, 311),
(2, 391),
(3, 381),
(4, 286),
(5, 328),
(6, 520),
(7, 422),
(8, 303),
(9, 480),
(10, 370),
(11, 380),
(12, 309),
(13, 316),
(14, 361),
(15, 351),
(16, 375),
(17, 360),
(18, 434),
(19, 412),
(20, 430),
(21, 420),
(22, 352),
(23, 503),
(24, 185),
(25, 355),
(26, 600),
(27, 580),
(28, 455),
(29, 495),
(30, 615),
(31, 560),
(32, 350),
(33, 280),
(34, 400),
(35, 460),
(36, 460),
(37, 370),
(38, 460),
(39, 280),
(40, 280),
(41, 280),
(42, 460),
(43, 300),
(44, 460),
(45, 560),
(46, 580),
(47, 520),
(48, 620),
(49, 350),
(50, 350),
(51, 520),
(52, 600),
(53, 600),
(54, 370),
(55, 440),
(56, 650),
(57, 320),
(58, 370),
(59, 370),
(60, 500),
(61, 320),
(62, 350),
(63, 340),
(64, 320),
(65, 350),
(66, 420),
(67, 340),
(68, 500),
(69, 500),
(70, 370);

-- --------------------------------------------------------

--
-- Structure de la table `declinaison_type`
--

CREATE TABLE `declinaison_type` (
  `id_version` int(10) UNSIGNED NOT NULL,
  `id_type` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `declinaison_type`
--

INSERT INTO `declinaison_type` (`id_version`, `id_type`) VALUES
(1, 7),
(2, 7),
(3, 1),
(4, 7),
(5, 1),
(6, 3),
(7, 10),
(8, 7),
(9, 1),
(10, 1),
(11, 1),
(12, 7),
(13, 7),
(14, 1),
(15, 7),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 3),
(21, 1),
(22, 7),
(23, 3),
(24, 7),
(25, 7),
(26, 1),
(27, 3),
(28, 1),
(29, 1),
(30, 3);

-- --------------------------------------------------------

--
-- Structure de la table `favorie`
--

CREATE TABLE `favorie` (
  `id_utilisateur` int(10) UNSIGNED NOT NULL,
  `id_annonce` int(10) UNSIGNED NOT NULL,
  `date_ajout` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `favorie`
--

INSERT INTO `favorie` (`id_utilisateur`, `id_annonce`, `date_ajout`) VALUES
(13, 1, '2026-06-18 15:21:29');

-- --------------------------------------------------------

--
-- Structure de la table `generation`
--

CREATE TABLE `generation` (
  `id_generation` int(10) UNSIGNED NOT NULL,
  `id_modele` int(10) UNSIGNED NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `date_sortie` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `generation`
--

INSERT INTO `generation` (`id_generation`, `id_modele`, `nom`, `date_sortie`) VALUES
(1, 1, '208 V Phase 2', '2023-01-01'),
(2, 2, 'Clio V', '2019-06-01'),
(3, 3, 'Golf VIII', '2020-01-01'),
(4, 4, 'Yaris IV', '2020-09-01'),
(5, 5, 'Sandero III', '2021-01-01'),
(6, 6, '3008 II Phase 2', '2021-06-01'),
(7, 7, 'Captur II', '2020-09-01'),
(8, 8, 'Fiesta VII', '2017-01-01'),
(9, 9, 'Série 3 G20', '2019-03-01'),
(10, 10, 'Classe A IV', '2018-03-01'),
(11, 11, 'A3 IV', '2020-09-01'),
(12, 12, 'Corsa F', '2019-10-01'),
(13, 13, 'C3 III Phase 2', '2020-01-01'),
(14, 14, 'Corolla XII', '2018-10-01'),
(15, 15, 'Polo VI', '2017-11-01'),
(16, 16, 'Focus IV', '2018-10-01'),
(17, 17, 'Série 1 F40', '2019-09-01'),
(18, 18, 'Mégane IV Phase 2', '2020-01-01'),
(19, 19, '308 III', '2021-12-01'),
(20, 20, 'Qashqai III', '2021-02-01'),
(21, 21, 'Civic XI', '2021-10-01'),
(22, 22, 'i20 III', '2020-12-01'),
(23, 23, 'Sportage V', '2021-06-01'),
(24, 24, '500 III', '2020-01-01'),
(25, 25, 'Ibiza V Phase 2', '2021-06-01'),
(26, 26, 'Octavia IV', '2020-01-01'),
(27, 27, 'RAV4 V', '2019-01-01'),
(28, 28, 'Classe C W206', '2021-07-01'),
(29, 29, 'A4 B10', '2023-02-01'),
(30, 30, 'Tiguan II Phase 2', '2021-09-01'),
(31, 33, 'Spark 2013', '2013-01-16'),
(32, 34, '2008 II', '2019-11-01'),
(33, 35, '2008 II', '2019-11-01'),
(34, 36, '508 II', '2018-06-01'),
(35, 37, '5008 II', '2016-10-01'),
(36, 38, 'Arkana I', '2021-02-01'),
(37, 39, 'Austral I', '2022-10-01'),
(38, 40, 'Zoé II', '2019-10-01'),
(39, 41, 'B8 Phase 2', '2019-09-01'),
(40, 42, 'T-Roc Phase 2', '2022-01-01'),
(41, 43, 'ID.3 Phase 2', '2023-06-01'),
(42, 44, 'C-HR II', '2023-09-01'),
(43, 45, 'Prius V', '2023-03-01'),
(44, 46, 'Land Cruiser 300', '2021-09-01'),
(45, 47, 'Duster III', '2023-11-01'),
(46, 48, 'Jogger I', '2022-02-01'),
(47, 49, 'Spring I', '2021-06-01'),
(48, 50, 'Puma I', '2019-10-01'),
(49, 51, 'Kuga III', '2020-01-01'),
(50, 52, 'G60', '2023-09-01'),
(51, 53, 'G01 LCI', '2021-10-01'),
(52, 54, 'G22', '2020-11-01'),
(53, 55, 'W214', '2023-10-01'),
(54, 56, 'X254', '2022-10-01'),
(55, 57, 'C118', '2019-06-01'),
(56, 58, 'GB', '2018-10-01'),
(57, 59, 'C8 Phase 2', '2023-10-01'),
(58, 60, 'F3 Phase 2', '2024-01-01'),
(59, 61, 'L', '2021-11-01'),
(60, 62, 'Grandland Phase 3', '2024-01-01'),
(61, 63, 'B', '2021-03-01'),
(62, 64, 'C4 III', '2020-10-01'),
(63, 65, 'Berlingo III', '2018-09-01'),
(64, 66, 'F16', '2019-10-01'),
(65, 67, 'ZE1', '2017-12-01'),
(66, 68, 'T33', '2022-07-01'),
(67, 69, 'GK5 e:HEV', '2020-07-01'),
(68, 70, 'RW6 e:PHEV', '2023-06-01'),
(69, 71, 'NX4 Phase 2', '2024-01-01'),
(70, 72, 'PDE Phase 2', '2020-09-01'),
(71, 73, 'SX2', '2023-07-01'),
(72, 74, 'CD Phase 2', '2021-10-01'),
(73, 75, 'SG2', '2022-07-01'),
(74, 76, 'EV6 Phase 2', '2024-01-01'),
(75, 77, 'KJ Phase 2', '2021-09-01'),
(76, 78, 'KL', '2020-01-01'),
(77, 79, 'NJ4', '2021-10-01'),
(78, 80, 'NU7 Phase 2', '2021-10-01'),
(79, 81, 'B9', '2024-01-01'),
(80, 82, 'Tipo II', '2020-12-01'),
(81, 83, '334', '2018-08-01'),
(82, 84, '199', '2005-09-01'),
(83, 85, 'GMT800 Phase 2', '2020-08-01'),
(84, 86, 'Gen 6', '2015-12-01'),
(85, 87, 'S60 III', '2018-10-01'),
(86, 88, 'V60 III', '2018-10-01'),
(87, 89, 'XC40 I Phase 2', '2022-01-01'),
(88, 90, 'XC60 II Phase 2', '2021-10-01'),
(89, 91, 'XC90 II Phase 2', '2019-10-01'),
(90, 92, 'S90 Phase 2', '2020-01-01'),
(91, 93, '992 Phase 2', '2023-10-01'),
(92, 94, 'E3 III', '2023-04-01'),
(93, 95, '95B II', '2021-10-01'),
(94, 96, 'J1 Phase 2', '2024-01-01'),
(95, 97, '982T Phase 2', '2023-06-01'),
(96, 98, 'Model 3 Highland', '2023-10-01'),
(97, 99, 'Model Y Phase 2', '2024-01-01'),
(98, 100, 'Model S Plaid', '2021-06-01'),
(99, 101, 'Model X Phase 2', '2021-06-01'),
(100, 102, 'X760 Phase 2', '2020-10-01'),
(101, 103, 'X761 Phase 2', '2020-10-01'),
(102, 104, 'X260 Phase 2', '2020-10-01'),
(103, 105, 'X152 Phase 2', '2019-10-01'),
(104, 106, 'L551 Phase 2', '2023-01-01'),
(105, 107, 'L550 Phase 2', '2023-06-01'),
(106, 108, 'L461', '2022-06-01'),
(107, 109, 'L663', '2019-10-01'),
(108, 110, 'F66', '2024-01-01'),
(109, 111, 'U25', '2023-10-01'),
(110, 112, 'J01', '2024-01-01'),
(111, 113, '952 Phase 2', '2023-01-01'),
(112, 114, '949 Phase 2', '2023-01-01'),
(113, 115, 'Tonale Phase 1', '2022-06-01'),
(114, 116, 'DJ Phase 2', '2023-01-01'),
(115, 117, 'BP Phase 2', '2023-06-01'),
(116, 118, 'KF Phase 2', '2022-01-01'),
(117, 119, 'DM Phase 2', '2023-06-01'),
(118, 120, 'DR', '2020-10-01'),
(119, 121, 'ND Phase 2', '2024-01-01'),
(120, 122, 'GS Phase 2', '2023-01-01'),
(121, 123, 'GK Phase 2', '2021-10-01'),
(122, 124, 'GN Phase 2', '2022-10-01'),
(123, 125, 'AZ Phase 2', '2023-06-01'),
(124, 126, 'LY Phase 2', '2023-01-01'),
(125, 127, 'YB Phase 2', '2022-10-01'),
(126, 128, 'JB74', '2018-07-01'),
(127, 129, 'GU', '2024-01-01'),
(128, 130, 'SK Phase 2', '2021-10-01'),
(129, 131, 'GK Phase 2', '2022-06-01'),
(130, 132, 'BT', '2021-01-01'),
(131, 133, 'Formentor Phase 2', '2024-01-01'),
(132, 134, 'KL Phase 2', '2024-01-01'),
(133, 135, 'Born Phase 2', '2024-01-01'),
(134, 136, 'DS3 E3', '2024-01-01'),
(135, 137, 'DS4 Phase 1', '2021-10-01'),
(136, 138, 'DS7 Phase 2', '2022-06-01'),
(137, 139, 'DS9 Phase 1', '2020-10-01'),
(138, 140, 'BU Phase 2', '2022-10-01'),
(139, 141, 'MP Phase 2', '2021-06-01'),
(140, 142, 'JL', '2017-11-01'),
(141, 143, 'WL', '2021-10-01'),
(142, 144, 'Avenger Phase 1', '2022-10-01'),
(143, 145, 'MG3 Hybrid+', '2024-01-01'),
(144, 146, 'ZS Phase 2', '2022-10-01'),
(145, 147, 'MG4 Phase 1', '2022-09-01'),
(146, 148, 'Marvel R Phase 1', '2021-06-01'),
(147, 149, 'HS Phase 2', '2023-01-01'),
(148, 150, 'IS Phase 3', '2020-10-01'),
(149, 151, 'NX Phase 2', '2021-10-01'),
(150, 152, 'RX Phase 5', '2022-10-01'),
(151, 153, 'UX Phase 2', '2022-10-01'),
(152, 154, '108 Phase 2', '2018-06-01'),
(153, 155, '508 SW II', '2018-10-01'),
(154, 156, 'e-2008 Phase 2', '2023-01-01'),
(155, 157, 'Twingo III Phase 2', '2019-06-01'),
(156, 158, 'Talisman Phase 2', '2020-06-01'),
(157, 159, 'R5 E-Tech Phase 1', '2024-06-01'),
(158, 160, 'Arteon Phase 2', '2020-10-01'),
(159, 161, 'Up! Phase 2', '2016-10-01'),
(160, 162, 'Touareg III Phase 2', '2023-01-01'),
(161, 163, 'Highlander XU70', '2019-10-01'),
(162, 164, 'Yaris Cross Phase 1', '2021-06-01'),
(163, 165, 'Aygo X AB40', '2022-03-01'),
(164, 166, 'X1 U11', '2022-10-01'),
(165, 167, 'X5 G05 LCI', '2023-04-01'),
(166, 168, 'Série 2 F44 LCI', '2023-06-01'),
(167, 169, 'Série 7 G70', '2022-10-01'),
(168, 170, 'i3 Phase 2', '2017-10-01'),
(169, 171, 'GLA H247 Phase 2', '2023-01-01'),
(170, 172, 'GLB X247', '2019-10-01'),
(171, 173, 'GLE V167 Phase 2', '2023-04-01'),
(172, 174, 'Classe B W247', '2018-10-01'),
(173, 175, 'EQA H243', '2021-01-01'),
(174, 176, 'Q5 FY Phase 2', '2024-01-01'),
(175, 177, 'Q7 4M Phase 2', '2024-01-01'),
(176, 178, 'TT 8S Phase 2', '2018-10-01'),
(177, 179, 'A5 F5 Phase 2', '2023-10-01'),
(178, 180, 'e-tron GE', '2023-10-01'),
(179, 181, 'Honda e Phase 1', '2020-10-01'),
(180, 182, 'HR-V III', '2021-10-01'),
(181, 183, 'ZR-V Phase 1', '2023-01-01'),
(182, 184, 'i10 III Phase 2', '2023-01-01'),
(183, 185, 'Ioniq 5 NE Phase 2', '2024-01-01'),
(184, 186, 'Ioniq 6 CE Phase 1', '2022-10-01'),
(185, 187, 'Picanto JA Phase 2', '2020-10-01'),
(186, 188, 'Stonic YB Phase 2', '2023-01-01'),
(187, 189, 'Sorento MQ4', '2020-10-01'),
(188, 190, 'Ka+ Phase 1', '2016-10-01'),
(189, 191, 'Explorer VI PHEV', '2019-10-01'),
(190, 192, 'Mustang Mach-E Phase 1', '2020-12-01');

-- --------------------------------------------------------

--
-- Structure de la table `marque`
--

CREATE TABLE `marque` (
  `id_marque` int(10) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `continent` varchar(50) DEFAULT NULL,
  `pays` varchar(100) DEFAULT NULL,
  `date_creation` year(4) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createur` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `marque`
--

INSERT INTO `marque` (`id_marque`, `nom`, `continent`, `pays`, `date_creation`, `description`, `createur`) VALUES
(1, 'Peugeot', 'Europe', 'France', '0000', 'Constructeur automobile français fondé en 1810', 'Armand Peugeot'),
(2, 'Renault', 'Europe', 'France', '0000', 'Constructeur automobile français', 'Louis Renault'),
(3, 'Volkswagen', 'Europe', 'Allemagne', '1937', 'Constructeur automobile allemand', 'Ferdinand Porsche'),
(4, 'Toyota', 'Asie', 'Japon', '1937', 'Constructeur automobile japonais', 'Kiichiro Toyoda'),
(5, 'Dacia', 'Europe', 'Roumanie', '1966', 'Constructeur roumain du groupe Renault', 'Nicolae Ceaușescu'),
(6, 'Ford', 'Amérique', 'États-Unis', '1903', 'Constructeur automobile américain', 'Henry Ford'),
(7, 'BMW', 'Europe', 'Allemagne', '1916', 'Bayerische Motoren Werke', 'Franz Josef Popp'),
(8, 'Mercedes-Benz', 'Europe', 'Allemagne', '1926', 'Constructeur automobile allemand de luxe', 'Karl Benz'),
(9, 'Audi', 'Europe', 'Allemagne', '1909', 'Constructeur automobile allemand premium', 'August Horch'),
(10, 'Opel', 'Europe', 'Allemagne', '0000', 'Constructeur automobile allemand', 'Adam Opel'),
(11, 'Citroën', 'Europe', 'France', '1919', 'Constructeur automobile français', 'André Citroën'),
(12, 'Nissan', 'Asie', 'Japon', '1933', 'Constructeur automobile japonais', 'Yoshisuke Aikawa'),
(13, 'Honda', 'Asie', 'Japon', '1948', 'Constructeur automobile et motocycles', 'Soichiro Honda'),
(14, 'Hyundai', 'Asie', 'Corée du Sud', '1967', 'Constructeur automobile coréen', 'Chung Ju-yung'),
(15, 'Kia', 'Asie', 'Corée du Sud', '1944', 'Constructeur automobile coréen', 'Kim Cheul-ho'),
(16, 'Fiat', 'Europe', 'Italie', '0000', 'Fabbrica Italiana Automobili Torino', 'Giovanni Agnelli'),
(17, 'SEAT', 'Europe', 'Espagne', '1950', 'Constructeur automobile espagnol du groupe VW', 'Instituto Nacional de Industria'),
(18, 'Škoda', 'Europe', 'République tchèque', '0000', 'Constructeur automobile tchèque du groupe VW', 'Václav Laurin'),
(19, 'Chevrolet', NULL, NULL, NULL, NULL, NULL),
(20, 'Volvo', 'Europe', 'Suède', '1927', 'Constructeur automobile suédois', 'Assar Gabrielsson'),
(21, 'Porsche', 'Europe', 'Allemagne', '1931', 'Constructeur allemand de voitures de sport', 'Ferdinand Porsche'),
(22, 'Tesla', 'Amérique', 'États-Unis', '2003', 'Constructeur de véhicules électriques', 'Elon Musk'),
(23, 'Jaguar', 'Europe', 'Royaume-Uni', '1922', 'Constructeur britannique de luxe', 'William Lyons'),
(24, 'Land Rover', 'Europe', 'Royaume-Uni', '1948', 'Constructeur de SUV britannique', 'Maurice Wilks'),
(25, 'MINI', 'Europe', 'Royaume-Uni', '1959', 'Constructeur appartenant au groupe BMW', 'Alec Issigonis'),
(26, 'Alfa Romeo', 'Europe', 'Italie', '1910', 'Constructeur automobile italien sportif', 'Nicola Romeo'),
(27, 'Mazda', 'Asie', 'Japon', '1920', 'Constructeur automobile japonais', 'Jujiro Matsuda'),
(28, 'Mitsubishi', 'Asie', 'Japon', '1970', 'Constructeur automobile japonais', 'Yataro Iwasaki'),
(29, 'Suzuki', 'Asie', 'Japon', '1909', 'Constructeur automobile japonais', 'Michio Suzuki'),
(30, 'Subaru', 'Asie', 'Japon', '1953', 'Constructeur japonais spécialiste de la transmission intégrale', 'Kenji Kita'),
(31, 'Cupra', 'Europe', 'Espagne', '2018', 'Marque sportive du groupe SEAT/VW', 'SEAT S.A.'),
(32, 'DS', 'Europe', 'France', '2014', 'Marque premium de Stellantis', 'Groupe PSA'),
(33, 'Jeep', 'Amérique', 'États-Unis', '1941', 'Constructeur de SUV et tout-terrains', 'Willys-Overland'),
(34, 'MG', 'Asie', 'Chine', '1924', 'Constructeur sino-britannique', 'Cecil Kimber'),
(35, 'Lexus', 'Asie', 'Japon', '1989', 'Division premium de Toyota', 'Eiji Toyoda'),
(36, 'Peugeot Sport', 'Europe', 'France', '1981', 'Division sportive de Peugeot', 'Jean Todt');

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `message` (
  `id_message` int(10) UNSIGNED NOT NULL,
  `id_expediteur` int(10) UNSIGNED NOT NULL,
  `id_destinataire` int(10) UNSIGNED NOT NULL,
  `id_annonce` int(10) UNSIGNED NOT NULL,
  `contenu` text NOT NULL,
  `lu` tinyint(1) NOT NULL DEFAULT 0,
  `date_envoi` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `message`
--

INSERT INTO `message` (`id_message`, `id_expediteur`, `id_destinataire`, `id_annonce`, `contenu`, `lu`, `date_envoi`) VALUES
(1, 13, 14, 1, 'Pas mal la voiture , elle est toujours en vente', 1, '2026-06-18 12:43:04'),
(2, 14, 13, 1, 'biens sûr', 1, '2026-06-18 12:59:00'),
(3, 13, 14, 1, 'combien la voiture', 1, '2026-06-18 13:02:14'),
(4, 14, 13, 1, '2222222 pour toi', 1, '2026-06-18 13:02:40'),
(5, 13, 14, 1, 't\'abuses', 1, '2026-06-18 13:03:08'),
(6, 13, 14, 2, 'Toujours en vente ?', 1, '2026-06-19 13:46:47'),
(7, 14, 13, 2, 'ouais', 0, '2026-06-19 13:48:23'),
(8, 17, 14, 1, 'Toujours en vente le gamos', 1, '2026-06-19 17:13:35'),
(9, 14, 17, 1, 'nan', 1, '2026-06-19 17:13:53');

-- --------------------------------------------------------

--
-- Structure de la table `modele`
--

CREATE TABLE `modele` (
  `id_modele` int(10) UNSIGNED NOT NULL,
  `id_marque` int(10) UNSIGNED NOT NULL,
  `id_type` int(10) UNSIGNED NOT NULL,
  `nom` varchar(150) NOT NULL,
  `annee_creation` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `modele`
--

INSERT INTO `modele` (`id_modele`, `id_marque`, `id_type`, `nom`, `annee_creation`) VALUES
(1, 1, 7, '208', '2012'),
(2, 2, 7, 'Clio', '1990'),
(3, 3, 1, 'Golf', '1974'),
(4, 4, 7, 'Yaris', '1999'),
(5, 5, 1, 'Sandero', '2008'),
(6, 1, 3, '3008', '2008'),
(7, 2, 10, 'Captur', '2013'),
(8, 6, 7, 'Fiesta', '1976'),
(9, 7, 1, 'Série 3', '1975'),
(10, 8, 1, 'Classe A', '1997'),
(11, 9, 1, 'A3', '1996'),
(12, 10, 7, 'Corsa', '1982'),
(13, 11, 7, 'C3', '2001'),
(14, 4, 1, 'Corolla', '1966'),
(15, 3, 7, 'Polo', '1975'),
(16, 6, 1, 'Focus', '1998'),
(17, 7, 1, 'Série 1', '2004'),
(18, 2, 1, 'Mégane', '1995'),
(19, 1, 1, '308', '2007'),
(20, 12, 3, 'Qashqai', '2006'),
(21, 13, 1, 'Civic', '1972'),
(22, 14, 7, 'i20', '2008'),
(23, 15, 3, 'Sportage', '1993'),
(24, 16, 7, '500', '1957'),
(25, 17, 7, 'Ibiza', '1984'),
(26, 18, 1, 'Octavia', '1959'),
(27, 4, 3, 'RAV4', '1994'),
(28, 8, 1, 'Classe C', '1993'),
(29, 9, 1, 'A4', '1994'),
(30, 3, 3, 'Tiguan', '2007'),
(33, 19, 7, 'Spark', NULL),
(34, 1, 10, '2008', '2013'),
(35, 1, 10, '2008', '2013'),
(36, 1, 1, '508', '2011'),
(37, 1, 3, '5008', '2016'),
(38, 2, 10, 'Arkana', '2019'),
(39, 2, 3, 'Austral', '2022'),
(40, 2, 7, 'Zoé', '2012'),
(41, 3, 2, 'Passat', '1973'),
(42, 3, 10, 'T-Roc', '2017'),
(43, 3, 7, 'ID.3', '2019'),
(44, 4, 10, 'C-HR', '2016'),
(45, 4, 1, 'Prius', '1997'),
(46, 4, 3, 'Land Cruiser', '1951'),
(47, 5, 3, 'Duster', '2010'),
(48, 5, 10, 'Jogger', '2021'),
(49, 5, 7, 'Spring', '2021'),
(50, 6, 10, 'Puma', '2019'),
(51, 6, 3, 'Kuga', '2008'),
(52, 7, 1, 'Série 5', '1972'),
(53, 7, 3, 'X3', '2003'),
(54, 7, 4, 'Série 4', '2013'),
(55, 8, 1, 'Classe E', '1993'),
(56, 8, 3, 'GLC', '2015'),
(57, 8, 4, 'CLA', '2013'),
(58, 9, 7, 'A1', '2010'),
(59, 9, 1, 'A6', '1994'),
(60, 9, 3, 'Q3', '2011'),
(61, 10, 1, 'Astra', '1991'),
(62, 10, 3, 'Grandland', '2017'),
(63, 10, 10, 'Mokka', '2012'),
(64, 11, 10, 'C4', '2020'),
(65, 11, 6, 'Berlingo', '1996'),
(66, 12, 10, 'Juke', '2010'),
(67, 12, 7, 'Leaf', '2010'),
(68, 12, 3, 'X-Trail', '2000'),
(69, 13, 7, 'Jazz', '2001'),
(70, 13, 3, 'CR-V', '1995'),
(71, 14, 3, 'Tucson', '2004'),
(72, 14, 1, 'i30', '2007'),
(73, 14, 10, 'Kona', '2017'),
(74, 15, 1, 'Cee\'d', '2006'),
(75, 15, 10, 'Niro', '2016'),
(76, 15, 3, 'EV6', '2021'),
(77, 17, 10, 'Arona', '2017'),
(78, 17, 1, 'Leon', '1998'),
(79, 18, 7, 'Fabia', '1999'),
(80, 18, 3, 'Karoq', '2017'),
(81, 18, 1, 'Superb', '2001'),
(82, 16, 1, 'Tipo', '2015'),
(83, 16, 10, '500X', '2014'),
(84, 16, 7, 'Grande Punto', '2005'),
(85, 19, 3, 'Trailblazer', '2001'),
(86, 19, 4, 'Camaro', '1966'),
(87, 20, 1, 'S60', '2000'),
(88, 20, 2, 'V60', '2010'),
(89, 20, 3, 'XC40', '2017'),
(90, 20, 3, 'XC60', '2008'),
(91, 20, 3, 'XC90', '2002'),
(92, 20, 1, 'S90', '2016'),
(93, 21, 4, '911', '1963'),
(94, 21, 3, 'Cayenne', '2002'),
(95, 21, 3, 'Macan', '2014'),
(96, 21, 1, 'Taycan', '2019'),
(97, 21, 4, '718 Cayman', '2016'),
(98, 22, 1, 'Model 3', '2017'),
(99, 22, 3, 'Model Y', '2020'),
(100, 22, 1, 'Model S', '2012'),
(101, 22, 3, 'Model X', '2015'),
(102, 23, 1, 'XE', '2015'),
(103, 23, 3, 'F-PACE', '2016'),
(104, 23, 1, 'XF', '2007'),
(105, 23, 4, 'F-TYPE', '2013'),
(106, 24, 3, 'Range Rover Evoque', '2011'),
(107, 24, 3, 'Discovery Sport', '2014'),
(108, 24, 3, 'Range Rover Sport', '2005'),
(109, 24, 3, 'Defender', '1983'),
(110, 25, 7, 'Cooper', '2001'),
(111, 25, 10, 'Countryman', '2010'),
(112, 25, 7, 'Cooper SE', '2019'),
(113, 26, 1, 'Giulia', '2016'),
(114, 26, 3, 'Stelvio', '2017'),
(115, 26, 10, 'Tonale', '2022'),
(116, 27, 7, 'Mazda2', '2003'),
(117, 27, 1, 'Mazda3', '2003'),
(118, 27, 3, 'CX-5', '2012'),
(119, 27, 3, 'CX-30', '2019'),
(120, 27, 3, 'MX-30', '2020'),
(121, 27, 4, 'MX-5', '1989'),
(122, 28, 3, 'ASX', '2010'),
(123, 28, 3, 'Eclipse Cross', '2017'),
(124, 28, 3, 'Outlander', '2003'),
(125, 29, 7, 'Swift', '2004'),
(126, 29, 10, 'Vitara', '1988'),
(127, 29, 10, 'S-Cross', '2013'),
(128, 29, 3, 'Jimny', '1970'),
(129, 30, 1, 'Impreza', '1992'),
(130, 30, 3, 'Forester', '1997'),
(131, 30, 3, 'XV', '2012'),
(132, 30, 3, 'Outback', '1994'),
(133, 31, 10, 'Formentor', '2020'),
(134, 31, 1, 'Leon', '2020'),
(135, 31, 7, 'Born', '2021'),
(136, 32, 10, 'DS 3 Crossback', '2018'),
(137, 32, 1, 'DS 4', '2021'),
(138, 32, 1, 'DS 7', '2017'),
(139, 32, 1, 'DS 9', '2020'),
(140, 33, 3, 'Renegade', '2014'),
(141, 33, 3, 'Compass', '2007'),
(142, 33, 3, 'Wrangler', '1986'),
(143, 33, 3, 'Grand Cherokee', '1992'),
(144, 33, 10, 'Avenger', '2022'),
(145, 34, 7, 'MG3', '2013'),
(146, 34, 3, 'ZS', '2017'),
(147, 34, 1, 'MG4', '2022'),
(148, 34, 3, 'Marvel R', '2021'),
(149, 34, 3, 'HS', '2018'),
(150, 35, 1, 'IS', '1998'),
(151, 35, 3, 'NX', '2014'),
(152, 35, 3, 'RX', '1997'),
(153, 35, 3, 'UX', '2018'),
(154, 1, 7, '108', '2014'),
(155, 1, 1, '508 SW', '2018'),
(156, 1, 10, 'e-2008', '2019'),
(157, 2, 7, 'Twingo', '1992'),
(158, 2, 1, 'Talisman', '2015'),
(159, 2, 7, 'R5 E-Tech', '2024'),
(160, 3, 1, 'Arteon', '2017'),
(161, 3, 7, 'Up!', '2011'),
(162, 3, 3, 'Touareg', '2002'),
(163, 4, 3, 'Highlander', '2000'),
(164, 4, 10, 'Yaris Cross', '2020'),
(165, 4, 7, 'Aygo X', '2022'),
(166, 7, 3, 'X1', '2009'),
(167, 7, 3, 'X5', '1999'),
(168, 7, 4, 'Série 2', '2013'),
(169, 7, 1, 'Série 7', '1977'),
(170, 7, 7, 'i3', '2013'),
(171, 8, 3, 'GLA', '2013'),
(172, 8, 3, 'GLB', '2019'),
(173, 8, 3, 'GLE', '1997'),
(174, 8, 7, 'Classe B', '2005'),
(175, 8, 1, 'EQA', '2021'),
(176, 9, 3, 'Q5', '2008'),
(177, 9, 3, 'Q7', '2005'),
(178, 9, 4, 'TT', '1998'),
(179, 9, 1, 'A5', '2007'),
(180, 9, 7, 'e-tron', '2018'),
(181, 13, 7, 'e', '2020'),
(182, 13, 3, 'HR-V', '2015'),
(183, 13, 3, 'ZR-V', '2023'),
(184, 14, 7, 'i10', '2007'),
(185, 14, 1, 'Ioniq 5', '2021'),
(186, 14, 1, 'Ioniq 6', '2022'),
(187, 15, 7, 'Picanto', '2004'),
(188, 15, 10, 'Stonic', '2017'),
(189, 15, 3, 'Sorento', '2002'),
(190, 6, 7, 'Ka+', '2016'),
(191, 6, 3, 'Explorer', '2019'),
(192, 6, 1, 'Mustang Mach-E', '2020');

-- --------------------------------------------------------

--
-- Structure de la table `moteur`
--

CREATE TABLE `moteur` (
  `id_moteur` int(10) UNSIGNED NOT NULL,
  `id_marque` int(10) UNSIGNED DEFAULT NULL,
  `nom` varchar(150) NOT NULL,
  `puissance_fiscale` smallint(6) DEFAULT NULL,
  `puissance_DIN` smallint(6) DEFAULT NULL,
  `cylindree` smallint(6) DEFAULT NULL,
  `couple_cumul` smallint(6) DEFAULT NULL,
  `nombre_cylindre` tinyint(4) DEFAULT NULL,
  `nombre_soupapes_cyclindre` tinyint(4) DEFAULT NULL,
  `alimentation` varchar(50) DEFAULT NULL,
  `type_suralimentation` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `moteur`
--

INSERT INTO `moteur` (`id_moteur`, `id_marque`, `nom`, `puissance_fiscale`, `puissance_DIN`, `cylindree`, `couple_cumul`, `nombre_cylindre`, `nombre_soupapes_cyclindre`, `alimentation`, `type_suralimentation`) VALUES
(1, 1, 'PureTech 100', 6, 100, 1199, 205, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(2, 2, 'TCe 100', 6, 100, 999, 160, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(3, 3, 'TSI 110', 8, 110, 1498, 200, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(4, 4, 'VVT-i 72', 5, 72, 998, 93, 3, 4, 'Injection indirecte', NULL),
(5, 5, 'SCe 65', 4, 65, 999, 91, 3, 4, 'Injection indirecte', NULL),
(6, 1, 'PureTech 130', 7, 130, 1199, 230, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(7, 2, 'TCe 130', 8, 130, 1333, 240, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(8, 6, 'EcoBoost 95', 6, 95, 999, 170, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(9, 7, 'B47 2.0d 190', 11, 190, 1995, 400, 4, 4, 'Injection directe diesel', 'Turbocompresseur'),
(10, 8, 'M282 1.3T 136', 8, 136, 1332, 230, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(11, 9, 'DKZA 1.5T 150', 9, 150, 1498, 250, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(12, 10, 'B12XHL 1.2T 100', 6, 100, 1199, 205, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(13, 11, 'EB2ADTS 1.2T 83', 6, 83, 1199, 160, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(14, 4, '2ZR-FXE Hybrid', 8, 122, 1798, 142, 4, 4, 'Hybride essence-électrique', NULL),
(15, 3, 'DLAC 1.0T 95', 5, 95, 999, 175, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(16, 6, 'EcoBoost 125', 7, 125, 999, 170, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(17, 7, 'B48B20A 170', 10, 170, 1998, 250, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(18, 2, 'H5Ht 1.3T 140', 8, 140, 1333, 260, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(19, 1, 'PureTech 110', 7, 110, 1199, 205, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(20, 12, 'MR13DDT 1.3T', 8, 140, 1332, 240, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(21, 13, 'LFA e:HEV 2.0', 10, 143, 1993, 175, 4, 4, 'Hybride essence-électrique', NULL),
(22, 14, 'G3LC 1.0T 100', 6, 100, 998, 172, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(23, 15, 'G4FJ 1.6T 150', 9, 150, 1591, 253, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(24, 16, '312A5 1.0 70', 4, 70, 999, 92, 3, 4, 'Injection directe', NULL),
(25, 17, 'DPCA 1.0T 95', 5, 95, 999, 175, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(26, 18, 'DADA 1.5T 150', 9, 150, 1498, 250, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(27, 4, 'A25A-FXS Hybrid', 13, 222, 2487, 221, 4, 4, 'Hybride essence-électrique', NULL),
(28, 8, 'M254 1.5T 170', 10, 170, 1496, 300, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(29, 9, 'DETA 2.0T 150', 9, 150, 1984, 320, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(30, 3, 'EA211 1.5T 150', 9, 150, 1498, 250, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(31, NULL, '1.0T 100ch', 6, 100, 999, 170, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(32, NULL, '1.0T 110ch', 6, 110, 999, 200, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(33, NULL, '1.0T 115ch', 7, 115, 999, 200, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(34, NULL, '1.0T 125ch', 7, 125, 999, 205, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(35, NULL, '1.2T 100ch', 6, 100, 1199, 205, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(36, NULL, '1.2T 130ch', 7, 130, 1199, 230, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(37, NULL, '1.5T 130ch', 8, 130, 1498, 200, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(38, NULL, '1.5T 150ch', 9, 150, 1498, 250, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(39, NULL, '1.5T 163ch', 9, 163, 1498, 250, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(40, NULL, '1.6T 180ch', 11, 180, 1598, 280, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(41, NULL, '2.0T 190ch', 12, 190, 1984, 320, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(42, NULL, '2.0T 245ch', 14, 245, 1984, 370, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(43, NULL, '2.0T 258ch', 15, 258, 1984, 400, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(44, NULL, '1.5D 110ch', 7, 110, 1499, 250, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(45, NULL, '1.5D 130ch', 8, 130, 1499, 300, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(46, NULL, '1.6D 115ch', 7, 115, 1598, 250, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(47, NULL, '2.0D 150ch', 9, 150, 1968, 340, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(48, NULL, '2.0D 180ch', 11, 180, 1968, 380, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(49, NULL, '2.0D 200ch', 12, 200, 1968, 400, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(50, NULL, '1.8 Hybride 122ch', 8, 122, 1798, 142, 4, 4, 'Injection indirecte', ''),
(51, NULL, 'E-Tech 145ch', 9, 145, 1598, 205, 4, 4, 'Hybride full', ''),
(52, NULL, '2.0 Hybride 184ch', 11, 184, 1987, 190, 4, 4, 'Hybride full', ''),
(53, NULL, 'PHEV 225ch', 13, 225, 2499, 165, 4, 4, 'Hybride rechargeable', 'Turbocompresseur'),
(54, NULL, 'Moteur électrique 136ch', NULL, 136, 0, 260, 0, 0, 'Electrique', ''),
(55, NULL, 'Moteur électrique 150ch', NULL, 150, 0, 245, 0, 0, 'Electrique', ''),
(56, NULL, 'Moteur électrique 204ch', NULL, 204, 0, 310, 0, 0, 'Electrique', ''),
(57, NULL, 'Moteur électrique 218ch', NULL, 218, 0, 340, 0, 0, 'Electrique', ''),
(58, NULL, '1.0T 100ch', 6, 100, 999, 170, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(59, NULL, '1.0T 110ch', 6, 110, 999, 200, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(60, NULL, '1.0T 115ch', 7, 115, 999, 200, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(61, NULL, '1.0T 125ch', 7, 125, 999, 205, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(62, NULL, '1.2T 100ch', 6, 100, 1199, 205, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(63, NULL, '1.2T 130ch', 7, 130, 1199, 230, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(64, NULL, '1.5T 130ch', 8, 130, 1498, 200, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(65, NULL, '1.5T 150ch', 9, 150, 1498, 250, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(66, NULL, '1.5T 163ch', 9, 163, 1498, 250, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(67, NULL, '1.6T 180ch', 11, 180, 1598, 280, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(68, NULL, '2.0T 190ch', 12, 190, 1984, 320, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(69, NULL, '2.0T 245ch', 14, 245, 1984, 370, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(70, NULL, '2.0T 258ch', 15, 258, 1984, 400, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(71, NULL, '1.5D 110ch', 7, 110, 1499, 250, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(72, NULL, '1.5D 130ch', 8, 130, 1499, 300, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(73, NULL, '1.6D 115ch', 7, 115, 1598, 250, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(74, NULL, '2.0D 150ch', 9, 150, 1968, 340, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(75, NULL, '2.0D 180ch', 11, 180, 1968, 380, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(76, NULL, '2.0D 200ch', 12, 200, 1968, 400, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(77, NULL, '1.8 Hybride 122ch', 8, 122, 1798, 142, 4, 4, 'Injection indirecte', ''),
(78, NULL, 'E-Tech 145ch', 9, 145, 1598, 205, 4, 4, 'Hybride full', ''),
(79, NULL, '2.0 Hybride 184ch', 11, 184, 1987, 190, 4, 4, 'Hybride full', ''),
(80, NULL, 'PHEV 225ch', 13, 225, 2499, 165, 4, 4, 'Hybride rechargeable', 'Turbocompresseur'),
(81, NULL, 'Moteur électrique 136ch', NULL, 136, 0, 260, 0, 0, 'Electrique', ''),
(82, NULL, 'Moteur électrique 150ch', NULL, 150, 0, 245, 0, 0, 'Electrique', ''),
(83, NULL, 'Moteur électrique 204ch', NULL, 204, 0, 310, 0, 0, 'Electrique', ''),
(84, NULL, 'Moteur électrique 218ch', NULL, 218, 0, 340, 0, 0, 'Electrique', ''),
(85, NULL, '1.0T 90ch', 5, 90, 999, 160, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(86, NULL, '1.2T 110ch', 6, 110, 1197, 205, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(87, NULL, '1.3T 150ch', 9, 150, 1332, 270, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(88, NULL, '1.5T 170ch', 10, 170, 1498, 270, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(89, NULL, '2.0T 200ch', 12, 200, 1984, 350, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(90, NULL, '2.0T 300ch', 17, 300, 1984, 450, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(91, NULL, '2.5T 367ch', 21, 367, 2480, 500, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(92, NULL, '3.0T 380ch', 22, 380, 2995, 520, 6, 4, 'Injection directe turbo', 'Turbocompresseur'),
(93, NULL, '3.0 Bi-Turbo 450ch', 26, 450, 2998, 600, 6, 4, 'Injection directe turbo', 'Biturbo'),
(94, NULL, '4.0 V8 Bi-Turbo 530ch', 30, 530, 3996, 770, 8, 4, 'Injection directe turbo', 'Biturbo'),
(95, NULL, '1.5D 95ch', 6, 95, 1499, 220, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(96, NULL, '2.0D 163ch', 10, 163, 1968, 380, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(97, NULL, '2.0D 190ch', 12, 190, 1950, 400, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(98, NULL, '3.0D 249ch', 15, 249, 2993, 500, 6, 4, 'Injection directe common rail', 'Turbocompresseur'),
(99, NULL, '3.0D 300ch', 18, 300, 2993, 650, 6, 4, 'Injection directe common rail', 'Biturbo'),
(100, NULL, 'Hybride 140ch', 8, 140, 1598, 230, 4, 4, 'Hybride full', ''),
(101, NULL, 'Hybride 200ch', 12, 200, 1798, 300, 4, 4, 'Hybride full', ''),
(102, NULL, 'Hybride 245ch', 14, 245, 2487, 350, 4, 4, 'Hybride full', ''),
(103, NULL, 'PHEV 305ch', 17, 305, 1598, 400, 4, 4, 'Hybride rechargeable', 'Turbocompresseur'),
(104, NULL, 'Electrique 170ch', NULL, 170, 0, 250, 0, 0, 'Electrique', ''),
(105, NULL, 'Electrique 245ch', NULL, 245, 0, 350, 0, 0, 'Electrique', ''),
(106, NULL, 'Electrique 286ch', NULL, 286, 0, 400, 0, 0, 'Electrique', ''),
(107, NULL, 'Electrique 340ch', NULL, 340, 0, 450, 0, 0, 'Electrique', ''),
(108, NULL, 'Electrique 440ch AWD', NULL, 440, 0, 600, 0, 0, 'Electrique', ''),
(109, NULL, 'Electrique 1020ch Plaid', NULL, 1020, 0, 1050, 0, 0, 'Electrique', ''),
(110, NULL, '2.0 Boxer 152ch', 9, 152, 1995, 196, 4, 4, 'Injection directe', ''),
(111, NULL, '2.5 Boxer 230ch Turbo', 14, 230, 2457, 350, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(112, NULL, '2.0T 265ch', 15, 265, 1998, 400, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(113, NULL, '1.5 Skyactiv-G 122ch', 7, 122, 1496, 213, 4, 4, 'Injection directe', ''),
(114, NULL, '2.0 Skyactiv-G 165ch', 10, 165, 1998, 213, 4, 4, 'Injection directe', ''),
(115, NULL, '2.5 Skyactiv-G 186ch', 11, 186, 2488, 252, 4, 4, 'Injection directe', ''),
(116, NULL, '1.5 Skyactiv-D 105ch', 6, 105, 1499, 220, 4, 4, 'Injection directe common rail', 'Turbocompresseur'),
(117, NULL, '3.0 Flat-6 385ch', 22, 385, 2981, 450, 6, 4, 'Injection directe turbo', 'Turbocompresseur'),
(118, NULL, '3.0 Flat-6 480ch S', 28, 480, 2981, 530, 6, 4, 'Injection directe turbo', 'Turbocompresseur'),
(119, NULL, '2.0 Flat-4 300ch', 17, 300, 1988, 380, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(120, NULL, '1.5 3cyl 136ch', 8, 136, 1499, 220, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(121, NULL, '1.4T 150ch', 9, 150, 1368, 270, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(122, NULL, '1.0 Boosterjet 112ch', 6, 112, 998, 170, 3, 4, 'Injection directe turbo', 'Turbocompresseur'),
(123, NULL, '1.4 Boosterjet 140ch', 8, 140, 1373, 230, 4, 4, 'Injection directe turbo', 'Turbocompresseur'),
(124, NULL, '1.5 Jimny 102ch', 6, 102, 1462, 130, 4, 4, 'Injection indirecte', '');

-- --------------------------------------------------------

--
-- Structure de la table `photo`
--

CREATE TABLE `photo` (
  `id_photo` int(10) UNSIGNED NOT NULL,
  `id_annonce` int(10) UNSIGNED NOT NULL,
  `url_photo` varchar(500) NOT NULL,
  `date_ajout` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `photo`
--

INSERT INTO `photo` (`id_photo`, `id_annonce`, `url_photo`, `date_ajout`) VALUES
(1, 1, '/uploads/photos/photo_6a31b21056de9.jpg', '2026-06-16 22:29:04'),
(65, 33, '/uploads/photos/photo_69fb35f5d92cc5.02703960.jpg', '2026-05-06 14:37:09'),
(66, 33, '/uploads/photos/photo_69fb361cb8d6b8.67097930.jpg', '2026-05-06 14:37:48'),
(74, 34, '/uploads/photos/photo_69fb3f98be2788.06639533.jpg', '2026-05-06 15:18:16'),
(77, 34, '/uploads/photos/photo_69fb3fdd6c9f71.36294974.jpg', '2026-05-06 15:19:25');

-- --------------------------------------------------------

--
-- Structure de la table `possession_moteur`
--

CREATE TABLE `possession_moteur` (
  `id_version` int(10) UNSIGNED NOT NULL,
  `id_moteur` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `possession_moteur`
--

INSERT INTO `possession_moteur` (`id_version`, `id_moteur`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18),
(19, 19),
(20, 20),
(21, 21),
(22, 22),
(23, 23),
(24, 24),
(25, 25),
(26, 26),
(27, 27),
(28, 28),
(29, 29),
(30, 30),
(32, 62),
(33, 63),
(34, 71),
(35, 81),
(36, 72),
(37, 67),
(38, 75),
(39, 63),
(40, 72),
(41, 75),
(42, 78),
(43, 64),
(44, 79),
(45, 64),
(46, 81),
(47, 82),
(48, 65),
(49, 74),
(50, 76),
(51, 59),
(52, 65),
(53, 74),
(54, 83),
(55, 83),
(56, 77),
(57, 79),
(58, 79),
(59, 79),
(60, 80),
(61, 76),
(62, 64),
(63, 64),
(64, 78),
(65, 59),
(66, 78),
(67, 81),
(68, 61),
(69, 65),
(70, 65),
(71, 72),
(72, 80),
(73, 68),
(74, 76),
(75, 75),
(76, 69),
(77, 65),
(78, 68),
(79, 70),
(80, 68),
(81, 76),
(82, 68),
(83, 76),
(84, 80),
(85, 66),
(86, 74),
(87, 58),
(88, 59),
(89, 65),
(90, 74),
(91, 76),
(92, 69),
(93, 65),
(94, 74),
(95, 69),
(96, 59),
(97, 63),
(98, 72),
(99, 79),
(100, 63),
(101, 72),
(102, 58),
(103, 81),
(104, 62),
(105, 63),
(106, 71),
(107, 81),
(108, 59),
(109, 71),
(110, 60),
(111, 78),
(112, 82),
(113, 84),
(114, 79),
(115, 79),
(116, 77),
(117, 79),
(118, 80),
(119, 65),
(120, 79),
(121, 73),
(122, 61),
(123, 66),
(124, 61),
(125, 84),
(126, 61),
(127, 66),
(128, 73),
(129, 78),
(130, 80),
(131, 83),
(132, 83),
(133, 84),
(134, 58),
(135, 59),
(136, 65),
(137, 59),
(138, 65),
(139, 74),
(140, 58),
(141, 58),
(142, 59),
(143, 60),
(144, 65),
(145, 74),
(146, 65),
(147, 74),
(148, 58),
(149, 64),
(150, 61),
(151, 64),
(152, 58),
(153, 62),
(154, 65),
(155, 74),
(156, 70),
(157, 69),
(158, 88),
(159, 89),
(160, 103),
(161, 88),
(162, 89),
(163, 105),
(164, 117),
(165, 118),
(166, 112),
(167, 92),
(168, 106),
(169, 107),
(170, 108),
(171, 106),
(172, 107),
(173, 109),
(174, 88),
(175, 89),
(176, 57),
(177, 89),
(178, 90),
(179, 113),
(180, 115),
(181, 114),
(182, 115),
(183, 96),
(184, 100),
(185, 122),
(186, 124),
(187, 110),
(188, 110),
(189, 88),
(190, 112),
(191, 87),
(192, 103),
(193, 90),
(194, 86),
(195, 104),
(196, 104),
(197, 105),
(198, 102),
(199, 103),
(200, 120),
(201, 89),
(202, 106),
(203, 92),
(204, 99),
(205, 88),
(206, 89),
(207, 89),
(208, 103),
(209, 97),
(210, 104),
(211, 107),
(212, 106),
(213, 108);

-- --------------------------------------------------------

--
-- Structure de la table `recherche`
--

CREATE TABLE `recherche` (
  `id_recherche` int(10) UNSIGNED NOT NULL,
  `id_utilisateur` int(10) UNSIGNED DEFAULT NULL,
  `id_annonce` int(10) UNSIGNED DEFAULT NULL,
  `date_recherche` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `recherche`
--

INSERT INTO `recherche` (`id_recherche`, `id_utilisateur`, `id_annonce`, `date_recherche`) VALUES
(1, NULL, NULL, '2024-05-01 08:30:00'),
(2, NULL, NULL, '2024-05-01 08:35:00'),
(3, NULL, NULL, '2024-05-01 09:00:00'),
(4, NULL, NULL, '2024-05-02 10:15:00'),
(5, NULL, NULL, '2024-05-02 10:20:00'),
(6, NULL, NULL, '2024-05-02 10:25:00'),
(7, NULL, NULL, '2024-05-03 14:15:00'),
(8, NULL, NULL, '2024-05-03 14:20:00'),
(9, NULL, NULL, '2024-05-03 14:25:00'),
(10, NULL, NULL, '2024-05-04 09:15:00'),
(11, NULL, NULL, '2024-05-04 09:20:00'),
(12, NULL, NULL, '2024-05-04 09:25:00'),
(13, NULL, NULL, '2024-05-05 13:15:00'),
(14, NULL, NULL, '2024-05-05 13:20:00'),
(15, NULL, NULL, '2024-05-05 13:25:00'),
(16, NULL, NULL, '2024-05-06 08:15:00'),
(17, NULL, NULL, '2024-05-06 08:20:00'),
(18, NULL, NULL, '2024-05-07 11:15:00'),
(19, NULL, NULL, '2024-05-07 11:20:00'),
(20, NULL, NULL, '2024-05-08 10:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `reservoir`
--

CREATE TABLE `reservoir` (
  `id_reservoir` int(10) UNSIGNED NOT NULL,
  `id_marque` int(10) UNSIGNED DEFAULT NULL,
  `volume` smallint(6) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservoir`
--

INSERT INTO `reservoir` (`id_reservoir`, `id_marque`, `volume`, `type`) VALUES
(1, NULL, 44, 'Essence'),
(2, NULL, 45, 'Essence'),
(3, NULL, 55, 'Essence'),
(4, NULL, 42, 'Essence'),
(5, NULL, 50, 'Essence'),
(6, NULL, 53, 'Essence'),
(7, NULL, 48, 'Essence'),
(8, NULL, 42, 'Essence'),
(9, NULL, 59, 'Diesel'),
(10, NULL, 43, 'Essence'),
(11, NULL, 55, 'Essence'),
(12, NULL, 40, 'Essence'),
(13, NULL, 45, 'Essence'),
(14, NULL, 43, 'Hybride'),
(15, NULL, 45, 'Essence'),
(16, NULL, 55, 'Essence'),
(17, NULL, 52, 'Essence'),
(18, NULL, 47, 'Essence'),
(19, NULL, 53, 'Essence'),
(20, NULL, 57, 'Essence'),
(21, NULL, 46, 'Hybride'),
(22, NULL, 45, 'Essence'),
(23, NULL, 52, 'Essence'),
(24, NULL, 35, 'Essence'),
(25, NULL, 45, 'Essence'),
(26, NULL, 55, 'Essence'),
(27, NULL, 55, 'Hybride'),
(28, NULL, 66, 'Essence'),
(29, NULL, 63, 'Essence'),
(30, NULL, 60, 'Essence'),
(31, NULL, 40, 'Essence'),
(32, NULL, 47, 'Essence'),
(33, NULL, 50, 'Essence'),
(34, NULL, 52, 'Essence'),
(35, NULL, 56, 'Essence'),
(36, NULL, 60, 'Essence'),
(37, NULL, 63, 'Essence'),
(38, NULL, 66, 'Essence'),
(39, NULL, 50, 'Diesel'),
(40, NULL, 57, 'Diesel'),
(41, NULL, 62, 'Diesel'),
(42, NULL, 67, 'Diesel'),
(43, NULL, 40, 'Hybride'),
(44, NULL, 43, 'Hybride'),
(45, NULL, 14, 'PHEV'),
(46, NULL, 40, 'Electrique'),
(47, NULL, 50, 'Electrique'),
(48, NULL, 62, 'Electrique'),
(49, NULL, 77, 'Electrique'),
(50, NULL, 40, 'Essence'),
(51, NULL, 47, 'Essence'),
(52, NULL, 50, 'Essence'),
(53, NULL, 52, 'Essence'),
(54, NULL, 56, 'Essence'),
(55, NULL, 60, 'Essence'),
(56, NULL, 63, 'Essence'),
(57, NULL, 66, 'Essence'),
(58, NULL, 50, 'Diesel'),
(59, NULL, 57, 'Diesel'),
(60, NULL, 62, 'Diesel'),
(61, NULL, 67, 'Diesel'),
(62, NULL, 40, 'Hybride'),
(63, NULL, 43, 'Hybride'),
(64, NULL, 14, 'PHEV'),
(65, NULL, 40, 'Electrique'),
(66, NULL, 50, 'Electrique'),
(67, NULL, 62, 'Electrique'),
(68, NULL, 77, 'Electrique'),
(69, NULL, 42, 'Essence'),
(70, NULL, 50, 'Diesel'),
(71, NULL, 57, 'Hybride'),
(72, NULL, 82, 'Electrique'),
(73, NULL, 17, 'PHEV'),
(74, NULL, 68, 'Essence'),
(75, NULL, 50, 'Diesel'),
(76, NULL, 57, 'Hybride'),
(77, NULL, 62, 'Electrique'),
(78, NULL, 14, 'PHEV'),
(79, NULL, 68, 'Essence'),
(80, NULL, 47, 'Diesel'),
(81, NULL, 52, 'Hybride'),
(82, NULL, 75, 'Electrique'),
(83, NULL, 17, 'PHEV'),
(84, NULL, 57, 'Essence'),
(85, NULL, 60, 'Diesel'),
(86, NULL, 65, 'Hybride'),
(87, NULL, 100, 'Electrique'),
(88, NULL, 17, 'PHEV'),
(89, NULL, 40, 'Essence'),
(90, NULL, 55, 'Diesel'),
(91, NULL, 52, 'Hybride'),
(92, NULL, 75, 'Electrique'),
(93, NULL, 14, 'PHEV'),
(94, NULL, 40, 'Essence'),
(95, NULL, 40, 'Diesel'),
(96, NULL, 70, 'Hybride'),
(97, NULL, 75, 'Electrique'),
(98, NULL, 17, 'PHEV'),
(99, NULL, 57, 'Essence'),
(100, NULL, 40, 'Diesel'),
(101, NULL, 80, 'Hybride'),
(102, NULL, 82, 'Electrique'),
(103, NULL, 14, 'PHEV'),
(104, NULL, 52, 'Essence'),
(105, NULL, 65, 'Diesel'),
(106, NULL, 57, 'Hybride'),
(107, NULL, 50, 'Electrique'),
(108, NULL, 17, 'PHEV'),
(109, NULL, 65, 'Essence'),
(110, NULL, 70, 'Diesel'),
(111, NULL, 68, 'Hybride'),
(112, NULL, 100, 'Electrique'),
(113, NULL, 15, 'PHEV'),
(114, NULL, 60, 'Essence'),
(115, NULL, 52, 'Diesel'),
(116, NULL, 57, 'Hybride'),
(117, NULL, 100, 'Electrique'),
(118, NULL, 12, 'PHEV');

-- --------------------------------------------------------

--
-- Structure de la table `type`
--

CREATE TABLE `type` (
  `id_type` int(10) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `type`
--

INSERT INTO `type` (`id_type`, `nom`, `description`) VALUES
(1, 'Berline', 'Carrosserie 3 volumes traditionnelle'),
(2, 'Break', 'Carrosserie familiale à grand coffre'),
(3, 'SUV', 'Sport Utility Vehicle, position haute'),
(4, 'Coupé', '2 portes, ligne sportive'),
(5, 'Cabriolet', 'Toit ouvrant ou escamotable'),
(6, 'Monospace', 'Grand volume, nombreuses places'),
(7, 'Citadine', 'Petite voiture urbaine'),
(8, 'Pick-up', 'Plateau arrière ouvert'),
(9, 'Utilitaire', 'Usage professionnel'),
(10, 'Crossover', 'Entre berline et SUV');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id_utilisateur` int(10) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `mdp` varchar(255) NOT NULL,
  `role` enum('admin','particulier','entreprise') NOT NULL DEFAULT 'particulier',
  `numero_phone` varchar(20) DEFAULT NULL,
  `date_inscription` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id_utilisateur`, `nom`, `prenom`, `username`, `email`, `mdp`, `role`, `numero_phone`, `date_inscription`) VALUES
(1, 'Admin', 'AutoMarket', NULL, 'admin@automarket.fr', '$2y$13$ZeNWaO8Yt/AfOWfZhXDA.uokFCssMixK6/CQkiDQPpzqkuku25FKK', 'admin', '0600000001', '2024-01-01 08:00:00'),
(14, 'Atsiz', 'Blusk', 'bluskdu68', 'blusk@mail.fr', '$2y$13$9.D1zGHmyKRzQM.gNTZy1uz00GtpRqvdjzOYbfJwoym9RC5NHAUR2', 'particulier', '', '2026-05-06 14:59:07'),
(16, 'Ojjeh', 'Akram', NULL, 'akram@ojjeh.fr', '$2y$13$o0yHQp.Ss967FUXCoe8aPudXfpH/q52K9Im3HijRHklk0l5v5qlEO', 'entreprise', NULL, '2026-05-07 22:11:41'),
(17, 'Bastien ', 'Heitzmann', 'bastiendu68', 'bastien@mail.fr', '$2y$13$0gXMVgVMUEj.xn.d8ggbL.Hqvr.YDUIb.lt5fEeFgm3j7.x/5rRN.', 'particulier', '', '2026-06-19 17:13:15'),
(18, 'Vendeur', 'de Car', 'Garage Hess', 'entreprise@mail.fr', '$2y$13$fHYDB1UahuIhw08bOkaxU.vSTeWM2suqAIClCP8VgS/r0ySYRyLtK', 'entreprise', '', '2026-06-20 12:05:05'),
(19, 'b', 'j', 'jb@mail.fr', 'j@u.fr', '$2y$13$Sg71KuvR3RbX83DocXHLduk7gBT5FgfZdESJlrV/KfX6xtq2ruCeu', 'particulier', '', '2026-06-20 13:20:35');

-- --------------------------------------------------------

--
-- Structure de la table `version`
--

CREATE TABLE `version` (
  `id_version` int(10) UNSIGNED NOT NULL,
  `id_generation` int(10) UNSIGNED NOT NULL,
  `id_reservoir` int(10) UNSIGNED DEFAULT NULL,
  `id_coffre` int(10) UNSIGNED DEFAULT NULL,
  `nom` varchar(150) NOT NULL,
  `vitesse_max` smallint(6) DEFAULT NULL,
  `consommation_urbaine` decimal(4,1) DEFAULT NULL,
  `consommation_extra_urbaine` decimal(4,1) DEFAULT NULL,
  `consomation_mixte` decimal(4,1) DEFAULT NULL,
  `emission_CO2` smallint(6) DEFAULT NULL,
  `Norme_euro` varchar(10) DEFAULT NULL,
  `Crit_air` tinyint(4) DEFAULT NULL,
  `nombre_portes` tinyint(4) DEFAULT NULL,
  `nombre_places` tinyint(4) DEFAULT NULL,
  `largeur_sans_retros` smallint(6) DEFAULT NULL,
  `hauteur` smallint(6) DEFAULT NULL,
  `empattement` smallint(6) DEFAULT NULL,
  `poids_vide` smallint(6) DEFAULT NULL,
  `largeur_pneu_avant` smallint(6) DEFAULT NULL,
  `largeur_pneu_arriere` smallint(6) DEFAULT NULL,
  `rapport_hL_pneu_avant` tinyint(4) DEFAULT NULL,
  `rapport_hL_pneu_arriere` tinyint(4) DEFAULT NULL,
  `diametre_jante_avant` tinyint(4) DEFAULT NULL,
  `diametre_jante_arriere` tinyint(4) DEFAULT NULL,
  `suspension_avant` varchar(100) DEFAULT NULL,
  `suspension_arriere` varchar(100) DEFAULT NULL,
  `freins_avant` varchar(100) DEFAULT NULL,
  `freins_arriere` varchar(100) DEFAULT NULL,
  `diametre_braquage` decimal(4,1) DEFAULT NULL,
  `transmission` varchar(50) DEFAULT NULL,
  `boite_vitesse` varchar(50) DEFAULT NULL,
  `nombre_rapport` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `version`
--

INSERT INTO `version` (`id_version`, `id_generation`, `id_reservoir`, `id_coffre`, `nom`, `vitesse_max`, `consommation_urbaine`, `consommation_extra_urbaine`, `consomation_mixte`, `emission_CO2`, `Norme_euro`, `Crit_air`, `nombre_portes`, `nombre_places`, `largeur_sans_retros`, `hauteur`, `empattement`, `poids_vide`, `largeur_pneu_avant`, `largeur_pneu_arriere`, `rapport_hL_pneu_avant`, `rapport_hL_pneu_arriere`, `diametre_jante_avant`, `diametre_jante_arriere`, `suspension_avant`, `suspension_arriere`, `freins_avant`, `freins_arriere`, `diametre_braquage`, `transmission`, `boite_vitesse`, `nombre_rapport`) VALUES
(1, 1, 1, 1, '1.2 PureTech 100 Active', 185, 6.5, 4.5, 5.2, 117, 'Euro 6d', 1, 5, 5, 1745, 1430, 2540, 1095, 195, 195, 55, 55, 16, 16, 'MacPherson', 'Poutre de torsion', 'Disques ventilés', 'Tambours', 10.4, 'Traction avant', 'Manuelle', 6),
(2, 2, 2, 2, '1.0 TCe 100 Evolution', 180, 6.8, 4.6, 5.4, 122, 'Euro 6d', 1, 5, 5, 1798, 1448, 2583, 1118, 195, 195, 55, 55, 16, 16, 'MacPherson', 'Poutre de torsion', 'Disques ventilés', 'Tambours', 10.6, 'Traction avant', 'Manuelle', 6),
(3, 3, 3, 3, '1.5 TSI 110 Life', 195, 7.2, 5.1, 5.9, 134, 'Euro 6d', 1, 5, 5, 1789, 1456, 2631, 1315, 205, 205, 55, 55, 16, 16, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 10.9, 'Traction avant', 'Manuelle', 6),
(4, 4, 4, 4, '1.0 VVT-i 72 Dynamic', 165, 6.0, 4.2, 4.9, 111, 'Euro 6d', 1, 5, 5, 1695, 1515, 2560, 1050, 185, 185, 60, 60, 15, 15, 'MacPherson', 'Poutre de torsion', 'Disques', 'Tambours', 9.8, 'Traction avant', 'Manuelle', 5),
(5, 5, 5, 5, '1.0 SCe 65 Access', 155, 6.8, 4.7, 5.5, 124, 'Euro 6d', 1, 5, 5, 1763, 1522, 2601, 1055, 195, 195, 55, 55, 15, 15, 'MacPherson', 'Poutre de torsion', 'Disques', 'Tambours', 10.8, 'Traction avant', 'Manuelle', 5),
(6, 6, 6, 6, '1.2 PureTech 130 Allure', 198, 8.2, 5.6, 6.6, 148, 'Euro 6d', 1, 5, 5, 1894, 1630, 2675, 1375, 215, 215, 60, 60, 17, 17, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 11.4, 'Traction avant', 'Automatique', 8),
(7, 7, 7, 7, '1.3 TCe 130 Business', 188, 7.5, 5.2, 6.1, 138, 'Euro 6d', 1, 5, 5, 1797, 1571, 2639, 1220, 205, 205, 55, 55, 16, 16, 'MacPherson', 'Poutre de torsion', 'Disques ventilés', 'Disques', 10.5, 'Traction avant', 'Manuelle', 6),
(8, 8, 8, 8, '1.0 EcoBoost 95 Titanium', 175, 6.5, 4.4, 5.2, 119, 'Euro 6d', 1, 5, 5, 1726, 1481, 2489, 1092, 185, 185, 60, 60, 15, 15, 'MacPherson', 'Poutre de torsion', 'Disques', 'Tambours', 10.2, 'Traction avant', 'Manuelle', 5),
(9, 9, 9, 9, '320d xDrive Sport', 235, 5.8, 4.1, 4.7, 124, 'Euro 6d', 1, 4, 5, 1825, 1440, 2851, 1570, 225, 225, 45, 45, 18, 18, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 11.6, 'Intégrale', 'Automatique', 8),
(10, 10, 10, 10, 'A 180 Progressive', 208, 7.8, 5.4, 6.3, 142, 'Euro 6d', 1, 5, 5, 1796, 1440, 2729, 1355, 205, 205, 55, 55, 16, 16, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 11.3, 'Traction avant', 'Automatique', 7),
(11, 11, 11, 11, '35 TFSI S tronic Advanced', 224, 8.1, 5.5, 6.5, 147, 'Euro 6d', 1, 5, 5, 1820, 1426, 2637, 1350, 215, 215, 45, 45, 17, 17, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 10.5, 'Traction avant', 'Automatique', 7),
(12, 12, 12, 12, '1.2 Turbo 100 Elegance', 182, 6.8, 4.6, 5.4, 121, 'Euro 6d', 1, 5, 5, 1765, 1481, 2562, 1154, 195, 195, 55, 55, 16, 16, 'MacPherson', 'Poutre de torsion', 'Disques ventilés', 'Tambours', 10.2, 'Traction avant', 'Manuelle', 6),
(13, 13, 13, 13, '1.2 PureTech 83 Feel', 172, 6.3, 4.3, 5.1, 116, 'Euro 6d', 1, 5, 5, 1748, 1490, 2597, 1058, 195, 195, 55, 55, 15, 15, 'MacPherson', 'Poutre de torsion', 'Disques', 'Tambours', 10.8, 'Traction avant', 'Manuelle', 5),
(14, 14, 14, 14, '1.8 Hybrid 122 Design', 180, 4.8, 4.3, 4.5, 102, 'Euro 6d', 1, 5, 5, 1790, 1435, 2640, 1345, 205, 205, 55, 55, 16, 16, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 10.6, 'Traction avant', 'Automatique', 1),
(15, 15, 15, 15, '1.0 TSI 95 Confortline', 178, 6.4, 4.3, 5.1, 116, 'Euro 6d', 1, 5, 5, 1751, 1461, 2564, 1095, 195, 195, 55, 55, 15, 15, 'MacPherson', 'Poutre de torsion', 'Disques', 'Tambours', 10.1, 'Traction avant', 'Manuelle', 5),
(16, 16, 16, 16, '1.0 EcoBoost 125 ST-Line', 195, 7.2, 5.0, 5.9, 134, 'Euro 6d', 1, 5, 5, 1823, 1472, 2648, 1278, 215, 215, 50, 50, 17, 17, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 10.8, 'Traction avant', 'Manuelle', 6),
(17, 17, 17, 17, '120i M Sport', 240, 8.5, 5.8, 6.9, 157, 'Euro 6d', 1, 5, 5, 1799, 1421, 2670, 1395, 225, 225, 40, 40, 18, 18, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 10.8, 'Traction avant', 'Automatique', 8),
(18, 18, 18, 18, '1.3 TCe 140 Intens', 202, 7.8, 5.4, 6.3, 141, 'Euro 6d', 1, 5, 5, 1814, 1447, 2669, 1275, 205, 205, 55, 55, 16, 16, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 10.8, 'Traction avant', 'Manuelle', 6),
(19, 19, 19, 19, '1.2 PureTech 110 Allure', 192, 7.5, 5.2, 6.1, 138, 'Euro 6d', 1, 5, 5, 1851, 1444, 2714, 1280, 215, 215, 45, 45, 17, 17, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 10.6, 'Traction avant', 'Manuelle', 6),
(20, 20, 20, 20, '1.3 DIG-T 140 Acenta', 195, 7.9, 5.4, 6.4, 144, 'Euro 6d', 1, 5, 5, 1838, 1625, 2665, 1350, 225, 225, 55, 55, 18, 18, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 11.2, 'Traction avant', 'Manuelle', 6),
(21, 21, 21, 21, 'e:HEV 143 Elegance', 180, 4.7, 4.3, 4.4, 100, 'Euro 6d', 1, 5, 5, 1802, 1415, 2735, 1350, 215, 215, 50, 50, 17, 17, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 11.0, 'Traction avant', 'Automatique', 1),
(22, 22, 22, 22, '1.0 T-GDI 100 Techno', 182, 6.7, 4.5, 5.3, 120, 'Euro 6d', 1, 5, 5, 1775, 1505, 2580, 1120, 195, 195, 55, 55, 16, 16, 'MacPherson', 'Poutre de torsion', 'Disques', 'Tambours', 10.4, 'Traction avant', 'Manuelle', 6),
(23, 23, 23, 23, '1.6 T-GDI 150 GT-Line', 195, 9.2, 6.4, 7.5, 170, 'Euro 6d', 1, 5, 5, 1865, 1635, 2680, 1495, 235, 235, 55, 55, 18, 18, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 11.3, 'Traction avant', 'Automatique', 7),
(24, 24, 24, 24, '1.0 70 Dolcevita', 162, 5.8, 4.0, 4.7, 108, 'Euro 6d', 1, 3, 4, 1627, 1488, 2300, 916, 185, 185, 55, 55, 15, 15, 'MacPherson', 'Poutre de torsion', 'Disques', 'Tambours', 9.7, 'Traction avant', 'Manuelle', 5),
(25, 25, 25, 25, '1.0 EcoTSI 95 Style', 178, 6.4, 4.3, 5.1, 116, 'Euro 6d', 1, 5, 5, 1780, 1444, 2563, 1095, 195, 195, 55, 55, 15, 15, 'MacPherson', 'Poutre de torsion', 'Disques', 'Tambours', 10.1, 'Traction avant', 'Manuelle', 5),
(26, 26, 26, 26, '1.5 TSI 150 Style', 210, 7.8, 5.3, 6.3, 142, 'Euro 6d', 1, 5, 5, 1829, 1468, 2686, 1360, 215, 215, 55, 55, 16, 16, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 10.6, 'Traction avant', 'Automatique', 7),
(27, 27, 27, 27, '2.5 Hybrid 222 Collection', 180, 6.1, 5.9, 6.0, 135, 'Euro 6d', 1, 5, 5, 1855, 1685, 2690, 1930, 235, 235, 55, 55, 18, 18, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 11.0, 'Intégrale', 'Automatique', 1),
(28, 28, 28, 28, 'C 200 AMG Line', 237, 8.4, 5.7, 6.8, 154, 'Euro 6d', 1, 4, 5, 1821, 1438, 2865, 1595, 225, 225, 50, 50, 17, 17, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 11.4, 'Propulsion', 'Automatique', 9),
(29, 29, 29, 29, '35 TFSI 150 S line', 225, 8.5, 5.7, 6.8, 154, 'Euro 6d', 1, 4, 5, 1842, 1412, 2908, 1530, 235, 235, 45, 45, 18, 18, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 11.2, 'Traction avant', 'Automatique', 7),
(30, 30, 30, 30, '1.5 TSI 150 R-Line', 205, 8.8, 6.0, 7.1, 162, 'Euro 6d', 1, 5, 5, 1839, 1640, 2677, 1520, 235, 235, 50, 50, 19, 19, 'MacPherson', 'Multibras', 'Disques ventilés', 'Disques', 11.8, 'Traction avant', 'Automatique', 7),
(31, 31, NULL, NULL, '1.0', 50, 8.0, 3.0, 4.0, 12, 'Euro 6d', 4, 5, 5, 12, 1313, 3, 2322, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', NULL),
(32, 33, 51, NULL, '1.2 PureTech 100 Man.', 180, 6.3, 4.5, 5.1, 117, 'Euro 6d', 1, 5, 5, 4157, 1536, 2606, 1230, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(33, 33, 51, NULL, '1.2 PureTech 130 EAT8', 195, 6.8, 4.7, 5.4, 124, 'Euro 6d', 1, 5, 5, 4157, 1536, 2606, 1290, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(34, 33, 58, NULL, '1.5 BlueHDi 110 Man.', 185, 4.9, 3.6, 4.0, 105, 'Euro 6d', 2, 5, 5, 4157, 1536, 2606, 1310, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(35, 33, 66, NULL, 'e-2008 136ch Electrique', 150, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4157, 1536, 2606, 1530, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(36, 34, 59, NULL, '1.5 BlueHDi 130 EAT8', 230, 4.6, 3.8, 4.1, 108, 'Euro 6d', 2, 4, 5, 4750, 1403, 2793, 1545, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(37, 34, 54, NULL, '1.6 PureTech 180 EAT8', 240, 7.6, 5.4, 6.2, 140, 'Euro 6d', 1, 4, 5, 4750, 1403, 2793, 1480, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(38, 34, 59, NULL, '2.0 BlueHDi 180 EAT8', 250, 5.3, 4.2, 4.6, 119, 'Euro 6d', 2, 4, 5, 4750, 1403, 2793, 1600, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(39, 35, 55, NULL, '1.2 PureTech 130 Man.', 195, 7.3, 5.2, 5.9, 137, 'Euro 6d', 1, 5, 7, 4641, 1644, 2840, 1540, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(40, 35, 60, NULL, '1.5 BlueHDi 130 EAT8', 205, 5.1, 3.9, 4.3, 115, 'Euro 6d', 2, 5, 7, 4641, 1644, 2840, 1660, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(41, 35, 60, NULL, '2.0 BlueHDi 180 EAT8', 218, 5.9, 4.4, 4.9, 128, 'Euro 6d', 2, 5, 7, 4641, 1644, 2840, 1720, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(42, 36, 63, NULL, 'E-Tech 145 Man.', 180, 5.1, 4.0, 4.4, 99, 'Euro 6d', 1, 5, 5, 4568, 1571, 2720, 1434, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Robotisée', 6),
(43, 36, 53, NULL, '1.3 TCe 140 EDC', 195, 7.0, 4.8, 5.6, 127, 'Euro 6d', 1, 5, 5, 4568, 1571, 2720, 1400, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(44, 37, 63, NULL, 'E-Tech 200 Auto', 180, 5.5, 4.4, 4.8, 109, 'Euro 6d', 1, 5, 5, 4510, 1623, 2740, 1560, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(45, 37, 53, NULL, '1.2 TCe 130 EDC', 195, 7.2, 4.9, 5.7, 128, 'Euro 6d', 1, 5, 5, 4510, 1623, 2740, 1480, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(46, 38, 65, NULL, 'R110 40kWh', 135, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4087, 1562, 2588, 1502, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(47, 38, 66, NULL, 'R135 52kWh', 140, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4087, 1562, 2588, 1528, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(48, 39, 55, NULL, '1.5 TSI 150 DSG7', 228, 6.9, 4.8, 5.5, 126, 'Euro 6d', 1, 4, 5, 4767, 1444, 2788, 1480, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(49, 39, 61, NULL, '2.0 TDI 150 DSG7', 238, 5.4, 3.9, 4.4, 115, 'Euro 6d', 2, 4, 5, 4767, 1444, 2788, 1560, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(50, 39, 61, NULL, '2.0 TDI 200 DSG7', 245, 5.7, 4.1, 4.7, 122, 'Euro 6d', 2, 4, 5, 4767, 1444, 2788, 1610, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(51, 40, 51, NULL, '1.0 TSI 110 Man.', 187, 6.8, 4.6, 5.3, 122, 'Euro 6d', 1, 5, 5, 4234, 1573, 2590, 1270, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(52, 40, 52, NULL, '1.5 TSI 150 DSG7', 200, 7.2, 4.9, 5.7, 130, 'Euro 6d', 1, 5, 5, 4234, 1573, 2590, 1350, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(53, 40, 58, NULL, '2.0 TDI 150 DSG7', 205, 5.4, 4.2, 4.6, 120, 'Euro 6d', 2, 5, 5, 4234, 1573, 2590, 1440, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(54, 41, 66, NULL, 'Pure 58 kWh 204ch', 160, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4262, 1448, 2771, 1714, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction arrière', 'Automatique', 1),
(55, 41, 68, NULL, 'Pro 77 kWh 204ch', 170, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4262, 1448, 2771, 1814, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction arrière', 'Automatique', 1),
(56, 42, 62, NULL, '1.8 Hybride 140ch', 160, 5.0, 4.1, 4.5, 103, 'Euro 6d', 1, 5, 5, 4360, 1510, 2640, 1415, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(57, 42, 63, NULL, '2.0 Hybride 197ch', 180, 5.5, 4.3, 4.8, 108, 'Euro 6d', 1, 5, 5, 4360, 1510, 2640, 1440, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(58, 42, 63, NULL, '2.0 Hybride 197ch 4x4', 175, 5.9, 4.8, 5.2, 118, 'Euro 6d', 1, 5, 5, 4360, 1510, 2640, 1555, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(59, 43, 63, NULL, '2.0 Hybride 223ch', 180, 5.0, 3.8, 4.3, 98, 'Euro 6d', 1, 4, 5, 4600, 1436, 2750, 1435, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(60, 43, 64, NULL, '2.0 PHEV 223ch', 180, 4.1, 3.0, 3.4, 78, 'Euro 6d', 1, 4, 5, 4600, 1436, 2750, 1495, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(61, 44, 61, NULL, '3.3 D-4D 250ch 4WD', 210, 9.5, 7.8, 8.5, 224, 'Euro 6d', 2, 5, 7, 4950, 1925, 2850, 2405, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 10),
(62, 45, 52, NULL, 'TCe 130 4x2 Man.', 174, 7.4, 5.4, 6.1, 138, 'Euro 6d', 1, 5, 5, 4340, 1693, 2677, 1290, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(63, 45, 52, NULL, 'TCe 130 4x4 Man.', 170, 7.7, 5.8, 6.4, 144, 'Euro 6d', 1, 5, 5, 4340, 1693, 2677, 1390, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Manuelle', 6),
(64, 45, 63, NULL, 'Hybride 140ch 4x2', 165, 5.4, 4.2, 4.6, 104, 'Euro 6d', 1, 5, 5, 4340, 1693, 2677, 1450, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(65, 46, 52, NULL, 'TCe 110 7 places Man.', 175, 7.4, 5.3, 6.0, 135, 'Euro 6d', 1, 5, 7, 4547, 1784, 2898, 1260, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(66, 46, 63, NULL, 'Hybride 140ch 5 places', 170, 5.3, 4.1, 4.5, 103, 'Euro 6d', 1, 5, 5, 4547, 1784, 2898, 1410, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(67, 47, 65, NULL, '65ch Electrique', 125, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 3701, 1584, 2423, 970, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(68, 48, 51, NULL, '1.0 EcoBoost 125 Man.', 192, 6.7, 4.5, 5.2, 118, 'Euro 6d', 1, 5, 5, 4197, 1534, 2588, 1291, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(69, 48, 51, NULL, '1.0 EcoBoost mHEV 155 DCT', 200, 7.4, 4.9, 5.8, 130, 'Euro 6d', 1, 5, 5, 4197, 1534, 2588, 1370, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(70, 49, 54, NULL, '1.5 EcoBoost 150 Man.', 196, 7.5, 5.3, 6.1, 138, 'Euro 6d', 1, 5, 5, 4614, 1682, 2710, 1540, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(71, 49, 59, NULL, '2.0 EcoBlue 120 Man.', 198, 5.5, 4.0, 4.6, 122, 'Euro 6d', 2, 5, 5, 4614, 1682, 2710, 1600, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(72, 49, 64, NULL, 'PHEV 225ch CVT', 200, 1.4, 1.1, 1.2, 28, 'Euro 6d', 1, 5, 5, 4614, 1682, 2710, 1820, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(73, 50, 57, NULL, '520i 48V 208ch Steptronic', 250, 7.8, 5.6, 6.4, 143, 'Euro 6d', 1, 4, 5, 5060, 1515, 2995, 1830, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 8),
(74, 50, 61, NULL, '520d 48V 197ch Steptronic', 250, 5.9, 4.5, 5.0, 132, 'Euro 6d', 2, 4, 5, 5060, 1515, 2995, 1900, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 8),
(75, 51, 61, NULL, 'xDrive20d 190ch Steptronic', 226, 6.4, 4.9, 5.4, 141, 'Euro 6d', 2, 5, 5, 4734, 1676, 2864, 1840, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 8),
(76, 51, 57, NULL, 'xDrive30i 245ch Steptronic', 235, 8.7, 6.2, 7.1, 162, 'Euro 6d', 1, 5, 5, 4734, 1676, 2864, 1820, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 8),
(77, 51, 55, NULL, 'xDrive20i 150ch Steptronic', 208, 7.5, 5.3, 6.1, 139, 'Euro 6d', 1, 5, 5, 4734, 1676, 2864, 1780, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(78, 52, 55, NULL, '420i 184ch Steptronic', 250, 8.4, 5.9, 6.8, 155, 'Euro 6d', 1, 2, 4, 4767, 1383, 2851, 1535, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 8),
(79, 52, 55, NULL, '430i 258ch Steptronic', 250, 8.8, 6.3, 7.2, 163, 'Euro 6d', 1, 2, 4, 4767, 1383, 2851, 1590, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 8),
(80, 53, 56, NULL, 'E 200 AMG 204ch 9G-Tronic', 250, 7.5, 5.5, 6.2, 141, 'Euro 6d', 1, 4, 5, 4949, 1468, 2961, 1740, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 9),
(81, 53, 61, NULL, 'E 220d AMG 197ch 9G-Tronic', 250, 5.6, 4.3, 4.8, 126, 'Euro 6d', 2, 4, 5, 4949, 1468, 2961, 1840, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 9),
(82, 54, 56, NULL, 'GLC 200 4MATIC 204ch', 230, 8.6, 6.4, 7.2, 163, 'Euro 6d', 1, 5, 5, 4716, 1640, 2888, 1905, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 9),
(83, 54, 60, NULL, 'GLC 220d 4MATIC 197ch', 234, 6.5, 4.9, 5.5, 144, 'Euro 6d', 2, 5, 5, 4716, 1640, 2888, 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 9),
(84, 54, 64, NULL, 'GLC 300e 4MATIC PHEV 313ch', 210, 1.7, 1.2, 1.4, 32, 'Euro 6d', 1, 5, 5, 4716, 1640, 2888, 2280, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(85, 55, 53, NULL, 'CLA 200 163ch 7G-DCT', 240, 7.8, 5.4, 6.3, 143, 'Euro 6d', 1, 4, 5, 4688, 1439, 2729, 1440, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(86, 55, 58, NULL, 'CLA 220d 150ch 8G-DCT', 237, 5.4, 4.1, 4.6, 120, 'Euro 6d', 2, 4, 5, 4688, 1439, 2729, 1540, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(87, 56, 50, NULL, '25 TFSI 95 Man.', 175, 6.2, 4.3, 4.9, 111, 'Euro 6d', 1, 5, 5, 4030, 1431, 2564, 1080, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 5),
(88, 56, 50, NULL, '30 TFSI 110 Man.', 196, 6.4, 4.4, 5.0, 114, 'Euro 6d', 1, 5, 5, 4030, 1431, 2564, 1110, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(89, 56, 50, NULL, '35 TFSI 150 S tronic', 218, 7.4, 5.1, 5.9, 133, 'Euro 6d', 1, 5, 5, 4030, 1431, 2564, 1160, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(90, 57, 60, NULL, '35 TDI 163ch S tronic', 235, 5.2, 4.0, 4.5, 118, 'Euro 6d', 2, 4, 5, 4939, 1457, 2924, 1760, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(91, 57, 60, NULL, '40 TDI 204ch S tronic', 250, 5.5, 4.2, 4.7, 123, 'Euro 6d', 2, 4, 5, 4939, 1457, 2924, 1790, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(92, 57, 57, NULL, '45 TFSI 245ch S tronic', 250, 8.5, 6.2, 7.0, 158, 'Euro 6d', 1, 4, 5, 4939, 1457, 2924, 1720, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(93, 58, 54, NULL, '35 TFSI 150 S tronic', 207, 7.8, 5.5, 6.3, 142, 'Euro 6d', 1, 5, 5, 4484, 1585, 2681, 1420, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(94, 58, 59, NULL, '35 TDI 150 S tronic', 205, 5.5, 4.2, 4.7, 122, 'Euro 6d', 2, 5, 5, 4484, 1585, 2681, 1510, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(95, 58, 54, NULL, '45 TFSI quattro 245ch', 230, 9.2, 6.8, 7.6, 174, 'Euro 6d', 1, 5, 5, 4484, 1585, 2681, 1580, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 7),
(96, 59, 51, NULL, '1.2 Turbo 110 Man.', 192, 7.1, 4.9, 5.6, 128, 'Euro 6d', 1, 5, 5, 4374, 1487, 2675, 1295, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(97, 59, 51, NULL, '1.2 Turbo 130 CVT', 200, 7.5, 5.2, 6.0, 136, 'Euro 6d', 1, 5, 5, 4374, 1487, 2675, 1350, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(98, 59, 58, NULL, '1.5 Diesel 130 Auto', 205, 5.4, 4.0, 4.5, 117, 'Euro 6d', 2, 5, 5, 4374, 1487, 2675, 1430, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(99, 59, 62, NULL, 'Hybride 180ch CVT', 218, 5.9, 4.6, 5.1, 115, 'Euro 6d', 1, 5, 5, 4374, 1487, 2675, 1580, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(100, 60, 53, NULL, '1.2 Turbo 130 Auto', 195, 7.5, 5.3, 6.1, 138, 'Euro 6d', 1, 5, 5, 4477, 1609, 2675, 1450, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(101, 60, 58, NULL, '1.5 Diesel 130 Auto', 208, 5.2, 3.9, 4.4, 116, 'Euro 6d', 2, 5, 5, 4477, 1609, 2675, 1560, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(102, 61, 50, NULL, '1.2 Turbo 100 Man.', 182, 6.9, 4.7, 5.4, 122, 'Euro 6d', 1, 5, 5, 4151, 1507, 2563, 1175, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(103, 61, 66, NULL, 'Electrique 136ch', 150, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4151, 1507, 2563, 1565, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(104, 62, 51, NULL, '1.2 PureTech 100 Man.', 185, 6.6, 4.5, 5.2, 118, 'Euro 6d', 1, 5, 5, 4360, 1505, 2671, 1260, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(105, 62, 51, NULL, '1.2 PureTech 130 EAT8', 195, 7.1, 4.8, 5.6, 127, 'Euro 6d', 1, 5, 5, 4360, 1505, 2671, 1310, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(106, 62, 58, NULL, '1.5 BlueHDi 110 Man.', 188, 4.9, 3.7, 4.1, 108, 'Euro 6d', 2, 5, 5, 4360, 1505, 2671, 1360, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(107, 62, 66, NULL, 'ë-C4 136ch Electrique', 150, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4360, 1505, 2671, 1560, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(108, 63, 52, NULL, '1.2 PureTech 110 Man.', 172, 7.2, 5.1, 5.8, 131, 'Euro 6d', 1, 5, 5, 4403, 1848, 2785, 1338, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(109, 63, 58, NULL, '1.5 BlueHDi 100 Man.', 170, 4.8, 3.6, 4.0, 104, 'Euro 6d', 2, 5, 5, 4403, 1848, 2785, 1415, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(110, 64, 51, NULL, 'DIG-T 114 Man.', 185, 6.7, 4.7, 5.4, 124, 'Euro 6d', 1, 5, 5, 4210, 1598, 2636, 1231, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(111, 64, 62, NULL, 'Hybride 143ch Auto', 175, 5.4, 4.2, 4.6, 104, 'Euro 6d', 1, 5, 5, 4210, 1598, 2636, 1418, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(112, 65, 65, NULL, '40 kWh 150ch', 150, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4490, 1540, 2700, 1558, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(113, 65, 67, NULL, '62 kWh 218ch e+', 157, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4490, 1540, 2700, 1645, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(114, 66, 63, NULL, 'e-Power 204ch 2WD', 180, 6.2, 4.8, 5.3, 120, 'Euro 6d', 1, 5, 5, 4680, 1720, 2706, 1773, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(115, 66, 63, NULL, 'e-Power 213ch 4WD', 175, 6.7, 5.1, 5.7, 128, 'Euro 6d', 1, 5, 7, 4680, 1720, 2706, 1899, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(116, 67, 62, NULL, 'e:HEV 109ch', 161, 4.8, 3.9, 4.2, 96, 'Euro 6d', 1, 5, 5, 4045, 1534, 2530, 1262, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(117, 68, 63, NULL, 'e:HEV 184ch 2WD', 180, 5.6, 4.4, 4.9, 110, 'Euro 6d', 1, 5, 5, 4694, 1685, 2701, 1716, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(118, 68, 64, NULL, 'e:PHEV 184ch 4WD', 175, 1.6, 1.2, 1.4, 33, 'Euro 6d', 1, 5, 5, 4694, 1685, 2701, 1870, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(119, 69, 53, NULL, '1.6 T-GDi 150 Man.', 193, 8.2, 5.8, 6.6, 150, 'Euro 6d', 1, 5, 5, 4500, 1650, 2680, 1475, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(120, 69, 63, NULL, '1.6 T-GDi Hybride 230ch', 193, 7.0, 5.4, 6.0, 136, 'Euro 6d', 1, 5, 5, 4500, 1650, 2680, 1665, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 6),
(121, 69, 59, NULL, '1.6 CRDi 115 Man.', 190, 5.8, 4.4, 4.9, 129, 'Euro 6d', 2, 5, 5, 4500, 1650, 2680, 1510, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(122, 70, 51, NULL, '1.0 T-GDi 120 Man.', 196, 7.0, 4.8, 5.5, 126, 'Euro 6d', 1, 5, 5, 4340, 1470, 2650, 1270, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(123, 70, 53, NULL, '1.5 T-GDi 160 DCT', 207, 7.7, 5.2, 6.0, 135, 'Euro 6d', 1, 5, 5, 4340, 1470, 2650, 1340, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(124, 71, 51, NULL, '1.0 T-GDi 120 iMT', 183, 6.9, 4.7, 5.4, 124, 'Euro 6d', 1, 5, 5, 4355, 1575, 2660, 1315, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(125, 71, 67, NULL, 'Electrique 218ch 65.4kWh', 172, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4355, 1575, 2660, 1685, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(126, 72, 51, NULL, '1.0 T-GDi 120 iMT', 192, 7.1, 4.8, 5.5, 125, 'Euro 6d', 1, 5, 5, 4310, 1452, 2650, 1260, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(127, 72, 53, NULL, '1.5 T-GDi 160 DCT', 204, 7.6, 5.2, 6.0, 136, 'Euro 6d', 1, 5, 5, 4310, 1452, 2650, 1335, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(128, 72, 58, NULL, '1.6 CRDi 115 Man.', 200, 5.6, 4.3, 4.7, 124, 'Euro 6d', 2, 5, 5, 4310, 1452, 2650, 1360, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(129, 73, 62, NULL, 'HEV 141ch DCT', 169, 5.0, 4.0, 4.4, 101, 'Euro 6d', 1, 5, 5, 4420, 1570, 2720, 1511, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 6),
(130, 73, 64, NULL, 'PHEV 183ch DCT', 164, 1.5, 1.1, 1.2, 27, 'Euro 6d', 1, 5, 5, 4420, 1570, 2720, 1726, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 6),
(131, 73, 67, NULL, 'EV 204ch 64.8kWh', 167, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4420, 1570, 2720, 1813, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(132, 74, 66, NULL, 'Standard Range 125kW 2WD', 185, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4695, 1546, 2900, 1890, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction arrière', 'Automatique', 1),
(133, 74, 68, NULL, 'Long Range 77.4kWh 4WD', 188, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4695, 1546, 2900, 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(134, 75, 50, NULL, '1.0 TSI 95 Man.', 176, 6.5, 4.4, 5.1, 116, 'Euro 6d', 1, 5, 5, 4138, 1562, 2563, 1172, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 5),
(135, 75, 50, NULL, '1.0 TSI 110 DSG7', 188, 7.0, 4.7, 5.5, 124, 'Euro 6d', 1, 5, 5, 4138, 1562, 2563, 1218, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(136, 75, 51, NULL, '1.5 TSI 150 DSG7', 202, 7.4, 4.9, 5.8, 131, 'Euro 6d', 1, 5, 5, 4138, 1562, 2563, 1268, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(137, 76, 51, NULL, '1.0 eTSI 110 DSG7', 194, 6.6, 4.5, 5.2, 118, 'Euro 6d', 1, 5, 5, 4284, 1435, 2686, 1230, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(138, 76, 51, NULL, '1.5 TSI 150 Man.', 218, 7.2, 4.9, 5.7, 129, 'Euro 6d', 1, 5, 5, 4284, 1435, 2686, 1270, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(139, 76, 58, NULL, '2.0 TDI 150 DSG7', 220, 5.4, 4.1, 4.6, 119, 'Euro 6d', 2, 5, 5, 4284, 1435, 2686, 1380, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(140, 77, 50, NULL, '1.0 MPI 65 Man.', 171, 6.9, 4.8, 5.5, 125, 'Euro 6d', 1, 5, 5, 4108, 1467, 2564, 1065, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 5),
(141, 77, 50, NULL, '1.0 TSI 95 Man.', 182, 6.4, 4.3, 4.9, 111, 'Euro 6d', 1, 5, 5, 4108, 1467, 2564, 1090, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 5),
(142, 77, 50, NULL, '1.0 TSI 110 DSG7', 196, 6.8, 4.5, 5.3, 120, 'Euro 6d', 1, 5, 5, 4108, 1467, 2564, 1130, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(143, 78, 53, NULL, '1.0 TSI 115 Man.', 185, 7.0, 4.8, 5.5, 124, 'Euro 6d', 1, 5, 5, 4382, 1604, 2638, 1295, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(144, 78, 53, NULL, '1.5 TSI 150 DSG7', 205, 7.5, 5.1, 6.0, 136, 'Euro 6d', 1, 5, 5, 4382, 1604, 2638, 1360, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(145, 78, 59, NULL, '2.0 TDI 150 DSG7', 208, 5.5, 4.1, 4.7, 122, 'Euro 6d', 2, 5, 5, 4382, 1604, 2638, 1440, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(146, 79, 56, NULL, '1.5 TSI 150 DSG7', 230, 7.4, 4.9, 5.8, 130, 'Euro 6d', 1, 4, 5, 4902, 1488, 2841, 1490, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(147, 79, 61, NULL, '2.0 TDI 150 DSG7', 235, 5.4, 4.0, 4.5, 118, 'Euro 6d', 2, 4, 5, 4902, 1488, 2841, 1600, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(148, 80, 51, NULL, '1.0 FireFly 100 Man.', 183, 7.0, 4.8, 5.5, 124, 'Euro 6d', 1, 5, 5, 4368, 1500, 2636, 1220, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(149, 80, 51, NULL, '1.5 Hybride 130 DCT', 198, 6.5, 4.7, 5.4, 122, 'Euro 6d', 1, 5, 5, 4368, 1500, 2636, 1310, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(150, 81, 51, NULL, '1.0 FireFly 120 Man.', 178, 6.8, 4.7, 5.4, 124, 'Euro 6d', 1, 5, 5, 4275, 1620, 2570, 1295, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(151, 81, 51, NULL, '1.5 Hybride 130 DCT', 192, 6.6, 4.8, 5.4, 123, 'Euro 6d', 1, 5, 5, 4275, 1620, 2570, 1365, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(152, 82, NULL, NULL, '1.2 8v 65ch Man.', 155, 7.8, 5.2, 6.2, 142, 'Euro 4', 1, 5, 5, 4030, 1490, 2510, 1040, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 5),
(153, 82, NULL, NULL, '1.4 16v 95ch Man.', 178, 8.4, 5.6, 6.6, 151, 'Euro 4', 1, 5, 5, 4030, 1490, 2510, 1080, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 5),
(154, 83, 55, NULL, '1.3T 155ch AT', 180, 9.5, 7.0, 8.0, 180, 'Euro 6d', 1, 5, 7, 4420, 1776, 2640, 1470, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 6),
(155, 83, 60, NULL, '2.0D 163ch AT 4WD', 175, 8.0, 5.9, 6.7, 176, 'Euro 6d', 2, 5, 7, 4420, 1776, 2640, 1610, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 6),
(156, 84, 56, NULL, '2.0T 275ch Man.', 250, 11.3, 7.2, 8.8, 198, 'Euro 6d', 1, 2, 4, 4784, 1344, 2811, 1536, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Manuelle', 6),
(157, 84, 57, NULL, '6.2 V8 453ch AT', 290, 18.1, 10.4, 13.5, 308, 'Euro 6d', 1, 2, 4, 4784, 1344, 2811, 1676, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 10),
(158, 85, 69, 31, 'B3 163ch Man.', 220, 7.0, 4.8, 5.5, 125, 'Euro 6d', 1, 5, 5, 4761, 1431, 2872, 1620, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(159, 85, 70, 32, 'B4 197ch Auto', 230, 7.5, 5.2, 5.9, 135, 'Euro 6d', 1, 5, 5, 4761, 1431, 2872, 1680, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(160, 85, 83, 33, 'T8 PHEV 455ch AWD', 250, 2.1, 1.5, 1.7, 38, 'Euro 6d', 1, 5, 5, 4761, 1431, 2872, 2100, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 8),
(161, 87, 69, 34, 'B3 163ch Man.', 180, 7.2, 5.0, 5.8, 132, 'Euro 6d', 1, 5, 5, 4425, 1600, 2702, 1590, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(162, 87, 70, 35, 'B4 197ch Auto', 190, 7.8, 5.4, 6.2, 142, 'Euro 6d', 1, 5, 5, 4425, 1600, 2702, 1650, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(163, 87, 81, 36, 'Recharge Pure Electric 231ch', 160, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4425, 1600, 2702, 2030, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(164, 91, 73, 37, 'Carrera 385ch', 293, 11.1, 7.2, 8.6, 194, 'Euro 6d', 1, 4, 4, 4519, 1322, 2450, 1505, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 8),
(165, 91, 73, 38, 'Carrera S 480ch', 308, 11.8, 7.5, 9.0, 206, 'Euro 6d', 1, 4, 4, 4519, 1322, 2450, 1530, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 8),
(166, 93, 73, 39, '2.0T 265ch', 232, 9.6, 6.8, 7.8, 178, 'Euro 6d', 1, 5, 5, 4681, 1570, 2807, 1830, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 7),
(167, 93, 74, 40, 'Macan S V6 380ch', 254, 10.8, 7.2, 8.4, 190, 'Euro 6d', 1, 5, 5, 4681, 1570, 2807, 1920, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 7),
(168, 96, 82, 41, 'Propulsion 283ch', 201, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4720, 1442, 2875, 1761, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 1),
(169, 96, 83, 42, 'Grande Autonomie 340ch', 201, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4720, 1442, 2875, 1830, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(170, 96, 83, 43, 'Performance 460ch', 261, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4720, 1442, 2875, 1850, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(171, 97, 82, 44, 'Propulsion 283ch', 217, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4751, 1624, 2890, 1909, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 1),
(172, 97, 83, 45, 'Grande Autonomie 340ch AWD', 217, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4751, 1624, 2890, 1979, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(173, 98, 84, 46, 'Plaid 1020ch', 322, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4970, 1445, 2960, 2162, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(174, 108, 69, 47, 'Cooper C 163ch', 225, 7.0, 4.8, 5.5, 125, 'Euro 6d', 1, 5, 5, 3862, 1458, 2526, 1215, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(175, 108, 70, 48, 'Cooper S 204ch', 242, 7.8, 5.3, 6.1, 138, 'Euro 6d', 1, 5, 5, 3862, 1458, 2526, 1270, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(176, 108, 81, 49, 'Cooper SE Electric 218ch', 170, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 3862, 1458, 2526, 1510, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(177, 111, 73, 50, '2.0T 200ch', 240, 8.5, 5.8, 6.7, 152, 'Euro 6d', 1, 5, 5, 4643, 1435, 2820, 1524, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 8),
(178, 111, 73, 51, '2.0T 280ch Veloce', 240, 9.2, 6.3, 7.2, 163, 'Euro 6d', 1, 5, 5, 4643, 1435, 2820, 1569, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 8),
(179, 115, 69, 52, 'Skyactiv-G 122ch', 197, 6.8, 4.6, 5.3, 121, 'Euro 6d', 1, 5, 5, 4460, 1435, 2725, 1358, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(180, 115, 70, 53, 'Skyactiv-G 186ch AWD', 220, 8.0, 5.6, 6.4, 146, 'Euro 6d', 1, 5, 5, 4460, 1435, 2725, 1478, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 6),
(181, 116, 72, 54, 'Skyactiv-G 165ch 2WD', 198, 7.8, 5.5, 6.3, 144, 'Euro 6d', 1, 5, 5, 4575, 1680, 2700, 1529, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(182, 116, 73, 55, 'Skyactiv-G 186ch AWD', 204, 8.4, 5.9, 6.8, 155, 'Euro 6d', 1, 5, 5, 4575, 1680, 2700, 1621, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 6),
(183, 116, 76, 56, 'Skyactiv-D 150ch 2WD', 206, 5.7, 4.3, 4.8, 128, 'Euro 6d', 2, 5, 5, 4575, 1680, 2700, 1591, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(184, 123, 69, 57, '1.2 Hybrid 83ch', 165, 5.0, 3.8, 4.2, 96, 'Euro 6d', 1, 5, 5, 3860, 1415, 2450, 920, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 5),
(185, 123, 69, 58, 'Boosterjet 112ch', 195, 5.6, 4.1, 4.6, 106, 'Euro 6d', 1, 5, 5, 3860, 1415, 2450, 970, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(186, 126, 80, 59, '1.5 102ch Man.', 145, 8.1, 6.2, 6.9, 158, 'Euro 6d', 1, 3, 4, 3645, 1645, 2250, 1095, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Manuelle', 5),
(187, 127, 72, 60, '2.0 Boxer e-Boxer 150ch', 193, 7.5, 5.4, 6.2, 141, 'Euro 6d', 1, 5, 5, 4475, 1456, 2670, 1540, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(188, 128, 73, 61, '2.0 Boxer e-Boxer 150ch', 188, 8.1, 5.9, 6.7, 154, 'Euro 6d', 1, 5, 5, 4640, 1695, 2670, 1620, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(189, 131, 69, 62, '1.5 TSI 150ch', 200, 7.0, 4.8, 5.5, 125, 'Euro 6d', 1, 5, 5, 4450, 1510, 2680, 1430, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(190, 131, 72, 63, '2.0 TSI 245ch AWD', 246, 8.5, 6.0, 6.8, 155, 'Euro 6d', 1, 5, 5, 4450, 1510, 2680, 1580, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 7),
(191, 136, 70, 64, 'PureTech 130ch', 188, 7.2, 5.0, 5.7, 129, 'Euro 6d', 1, 5, 5, 4590, 1570, 2730, 1470, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(192, 136, 83, 65, 'E-TENSE 4x4 360ch', 235, 1.4, 1.0, 1.2, 27, 'Euro 6d', 1, 5, 5, 4590, 1570, 2730, 1920, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 8),
(193, 140, 74, 66, '2.0T 272ch Auto', 180, 11.2, 7.8, 8.9, 203, 'Euro 6d', 1, 5, 5, 4882, 1875, 3008, 1935, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 8),
(194, 142, 69, 67, '1.2T 100ch Man.', 184, 6.6, 4.5, 5.2, 118, 'Euro 6d', 1, 5, 5, 4084, 1530, 2560, 1278, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Manuelle', 6),
(195, 142, 81, 68, 'Electrique 156ch', 150, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4084, 1530, 2560, 1578, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 1),
(196, 145, 81, 69, 'Standard 170ch 51kWh', 160, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4287, 1504, 2705, 1655, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 1),
(197, 145, 83, 70, 'Long Range 245ch 64kWh', 160, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4287, 1504, 2705, 1770, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 1),
(198, 149, 72, 31, '350h AWD 245ch', 200, 6.4, 5.0, 5.5, 126, 'Euro 6d', 1, 5, 5, 4660, 1660, 2690, 1790, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(199, 149, 83, 32, '450h+ PHEV 309ch AWD', 200, 1.2, 0.9, 1.0, 22, 'Euro 6d', 1, 5, 5, 4660, 1660, 2690, 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(200, 164, 69, 33, 'sDrive 18i 136ch', 205, 7.0, 5.0, 5.6, 128, 'Euro 6d', 1, 5, 5, 4500, 1642, 2692, 1530, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(201, 164, 70, 34, 'xDrive 23i 218ch', 230, 7.8, 5.4, 6.2, 140, 'Euro 6d', 1, 5, 5, 4500, 1642, 2692, 1650, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 7),
(202, 164, 83, 35, 'iX1 xDrive 30 313ch', 180, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4500, 1642, 2692, 2080, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(203, 165, 74, 36, 'xDrive 40i 381ch', 250, 10.2, 7.0, 8.0, 181, 'Euro 6d', 1, 5, 5, 4922, 1745, 2975, 2165, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 8),
(204, 165, 76, 37, 'xDrive 40d 340ch', 250, 7.2, 5.4, 6.0, 158, 'Euro 6d', 2, 5, 5, 4922, 1745, 2975, 2240, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 8),
(205, 169, 69, 38, '200 163ch', 207, 7.2, 5.1, 5.8, 132, 'Euro 6d', 1, 5, 5, 4410, 1585, 2729, 1455, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 8),
(206, 169, 70, 39, '250 4MATIC 224ch', 240, 8.0, 5.6, 6.4, 145, 'Euro 6d', 1, 5, 5, 4410, 1585, 2729, 1570, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 8),
(207, 174, 72, 40, '40 TFSI 204ch', 222, 7.8, 5.4, 6.2, 142, 'Euro 6d', 1, 5, 5, 4680, 1640, 2820, 1770, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Traction avant', 'Automatique', 7),
(208, 174, 83, 41, '50 TFSI e 299ch PHEV', 230, 1.8, 1.2, 1.4, 32, 'Euro 6d', 1, 5, 5, 4680, 1640, 2820, 2070, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 7),
(209, 174, 76, 42, '40 TDI 204ch Quattro', 222, 5.8, 4.4, 4.9, 128, 'Euro 6d', 2, 5, 5, 4680, 1640, 2820, 1870, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 7),
(210, 183, 81, 43, '58 kWh Propulsion 170ch', 185, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4635, 1605, 3000, 1830, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 1),
(211, 183, 83, 44, '77 kWh AWD 325ch', 185, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4635, 1605, 3000, 2050, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1),
(212, 190, 82, 45, 'Standard Range 269ch RWD', 180, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4713, 1600, 2984, 1920, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Propulsion', 'Automatique', 1),
(213, 190, 84, 46, 'Extended Range 487ch AWD GT', 200, NULL, NULL, NULL, 0, 'Euro 6d', 0, 5, 5, 4713, 1600, 2984, 2210, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Intégrale', 'Automatique', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `annonce`
--
ALTER TABLE `annonce`
  ADD PRIMARY KEY (`id_annonce`);

--
-- Index pour la table `avis_modele`
--
ALTER TABLE `avis_modele`
  ADD PRIMARY KEY (`id_avis_modele`),
  ADD KEY `idx_avis_modele_modele` (`id_modele`),
  ADD KEY `idx_avis_modele_redacteur` (`id_redacteur`);

--
-- Index pour la table `avis_utilisateur`
--
ALTER TABLE `avis_utilisateur`
  ADD PRIMARY KEY (`id_avis_utilisateur`),
  ADD KEY `idx_avis_vendeur` (`id_vendeur`),
  ADD KEY `idx_avis_redacteur` (`id_redacteur`);

--
-- Index pour la table `coffre`
--
ALTER TABLE `coffre`
  ADD PRIMARY KEY (`id_coffre`);

--
-- Index pour la table `declinaison_type`
--
ALTER TABLE `declinaison_type`
  ADD PRIMARY KEY (`id_version`,`id_type`),
  ADD KEY `fk_dt_type` (`id_type`);

--
-- Index pour la table `favorie`
--
ALTER TABLE `favorie`
  ADD PRIMARY KEY (`id_utilisateur`,`id_annonce`),
  ADD KEY `fk_favorie_annonce` (`id_annonce`);

--
-- Index pour la table `generation`
--
ALTER TABLE `generation`
  ADD PRIMARY KEY (`id_generation`),
  ADD KEY `idx_generation_modele` (`id_modele`);

--
-- Index pour la table `marque`
--
ALTER TABLE `marque`
  ADD PRIMARY KEY (`id_marque`),
  ADD UNIQUE KEY `uq_marque_nom` (`nom`);

--
-- Index pour la table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id_message`),
  ADD KEY `idx_message_expediteur` (`id_expediteur`),
  ADD KEY `idx_message_destinataire` (`id_destinataire`),
  ADD KEY `idx_message_annonce` (`id_annonce`);

--
-- Index pour la table `modele`
--
ALTER TABLE `modele`
  ADD PRIMARY KEY (`id_modele`),
  ADD KEY `idx_modele_marque` (`id_marque`),
  ADD KEY `idx_modele_type` (`id_type`);

--
-- Index pour la table `moteur`
--
ALTER TABLE `moteur`
  ADD PRIMARY KEY (`id_moteur`),
  ADD KEY `fk_moteur_marque` (`id_marque`);

--
-- Index pour la table `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id_photo`),
  ADD KEY `idx_photo_annonce` (`id_annonce`);

--
-- Index pour la table `reservoir`
--
ALTER TABLE `reservoir`
  ADD PRIMARY KEY (`id_reservoir`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id_utilisateur`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Index pour la table `version`
--
ALTER TABLE `version`
  ADD PRIMARY KEY (`id_version`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `annonce`
--
ALTER TABLE `annonce`
  MODIFY `id_annonce` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `avis_modele`
--
ALTER TABLE `avis_modele`
  MODIFY `id_avis_modele` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `avis_utilisateur`
--
ALTER TABLE `avis_utilisateur`
  MODIFY `id_avis_utilisateur` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `coffre`
--
ALTER TABLE `coffre`
  MODIFY `id_coffre` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT pour la table `message`
--
ALTER TABLE `message`
  MODIFY `id_message` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `moteur`
--
ALTER TABLE `moteur`
  MODIFY `id_moteur` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT pour la table `photo`
--
ALTER TABLE `photo`
  MODIFY `id_photo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT pour la table `reservoir`
--
ALTER TABLE `reservoir`
  MODIFY `id_reservoir` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id_utilisateur` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `version`
--
ALTER TABLE `version`
  MODIFY `id_version` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=214;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
