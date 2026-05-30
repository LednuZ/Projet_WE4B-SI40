<?php

namespace App\Repository;

use App\Service\DatabaseService;

class StatsRepository
{
    public function __construct(private DatabaseService $db) {}

    public function getGlobalStats(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT
                COUNT(*) AS total_annonces,
                COUNT(CASE WHEN statut = "active" THEN 1 END) AS annonces_actives,
                ROUND(AVG(CASE WHEN statut = "active" THEN prix END), 0) AS prix_moyen,
                MIN(CASE WHEN statut = "active" THEN prix END) AS prix_min,
                MAX(CASE WHEN statut = "active" THEN prix END) AS prix_max,
                ROUND(AVG(CASE WHEN statut = "active" THEN kilometrage END), 0) AS km_moyen
            FROM annonce
        ');
        return $stmt->fetch();
    }

    public function getPrixMoyenParMarque(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT ma.nom AS marque, ROUND(AVG(a.prix), 0) AS prix_moyen, COUNT(a.id_annonce) AS nb
            FROM annonce a
            JOIN version v ON v.id_version = a.id_version
            JOIN generation g ON g.id_generation = v.id_generation
            JOIN modele mo ON mo.id_modele = g.id_modele
            JOIN marque ma ON ma.id_marque = mo.id_marque
            WHERE a.statut = "active"
            GROUP BY ma.id_marque
            ORDER BY nb DESC
            LIMIT 10
        ');
        return $stmt->fetchAll();
    }

    public function getModelesLesPlusAnnonces(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT ma.nom AS marque, mo.nom AS modele, COUNT(a.id_annonce) AS nb
            FROM annonce a
            JOIN version v ON v.id_version = a.id_version
            JOIN generation g ON g.id_generation = v.id_generation
            JOIN modele mo ON mo.id_modele = g.id_modele
            JOIN marque ma ON ma.id_marque = mo.id_marque
            WHERE a.statut = "active"
            GROUP BY mo.id_modele
            ORDER BY nb DESC
            LIMIT 10
        ');
        return $stmt->fetchAll();
    }

    public function getAnnoncesParAnnee(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT a.annee_circulation AS annee, COUNT(*) AS nb, ROUND(AVG(a.prix), 0) AS prix_moyen
            FROM annonce a
            WHERE a.statut = "active" AND a.annee_circulation IS NOT NULL
            GROUP BY a.annee_circulation
            ORDER BY a.annee_circulation DESC
            LIMIT 15
        ');
        return $stmt->fetchAll();
    }

    public function getAnnoncesParCarburant(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT r.type AS carburant, COUNT(a.id_annonce) AS nb, ROUND(AVG(a.prix), 0) AS prix_moyen
            FROM annonce a
            JOIN version v ON v.id_version = a.id_version
            JOIN reservoir r ON r.id_reservoir = v.id_reservoir
            WHERE a.statut = "active" AND v.id_reservoir IS NOT NULL
            GROUP BY r.type
            ORDER BY nb DESC
        ');
        return $stmt->fetchAll();
    }

    // ── STATS PERSONNELLES (entreprise) ──────────────────────────────────────

    public function getStatsEntreprise(int $userId): array
    {
        $pdo = $this->db->getConnection();

        $stmt = $pdo->prepare('
            SELECT
                COUNT(*) AS total,
                COUNT(CASE WHEN statut = "active" THEN 1 END) AS actives,
                COUNT(CASE WHEN statut = "pause"  THEN 1 END) AS en_pause,
                COUNT(CASE WHEN statut = "vendu"  THEN 1 END) AS vendues,
                ROUND(SUM(CASE WHEN statut = "vendu" THEN prix END), 0) AS ca_total,
                ROUND(AVG(CASE WHEN statut = "vendu" THEN prix END), 0) AS prix_moyen_vente,
                ROUND(AVG(CASE WHEN statut = "vendu" AND date_publication IS NOT NULL
                    THEN DATEDIFF(COALESCE(date_vente, date_modification), date_publication) END), 0) AS delai_moyen_jours
            FROM annonce
            WHERE id_utilisateur = ?
        ');
        $stmt->execute([$userId]);
        $kpis = $stmt->fetch();

        $kpis['taux_conversion'] = $kpis['total'] > 0
            ? round($kpis['vendues'] / $kpis['total'] * 100, 1)
            : 0;

        return $kpis;
    }

    public function getVentesParMoisEntreprise(int $userId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT
                DATE_FORMAT(COALESCE(date_vente, date_modification), "%Y-%m") AS mois,
                DATE_FORMAT(COALESCE(date_vente, date_modification), "%b %Y") AS mois_label,
                COUNT(*) AS nb_ventes,
                ROUND(AVG(prix), 0) AS prix_moyen
            FROM annonce
            WHERE statut = "vendu"
                AND id_utilisateur = ?
                AND COALESCE(date_vente, date_modification) >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY mois, mois_label
            ORDER BY mois ASC
        ');
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public function getTopModelesVendusEntreprise(int $userId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT ma.nom AS marque, mo.nom AS modele,
                COUNT(a.id_annonce) AS nb_ventes,
                ROUND(AVG(a.prix), 0) AS prix_moyen
            FROM annonce a
            JOIN version v ON v.id_version = a.id_version
            JOIN generation g ON g.id_generation = v.id_generation
            JOIN modele mo ON mo.id_modele = g.id_modele
            JOIN marque ma ON ma.id_marque = mo.id_marque
            WHERE a.statut = "vendu" AND a.id_utilisateur = ?
            GROUP BY mo.id_modele
            ORDER BY nb_ventes DESC
            LIMIT 5
        ');
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }
}
