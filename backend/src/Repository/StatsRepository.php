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

    // ── STATS ADMIN ──────────────────────────────────────────────────────────

    public function getAdminKpis(): array
    {
        $pdo = $this->db->getConnection();

        $row = $pdo->query('
            SELECT
                (SELECT COUNT(*) FROM utilisateur) AS total_utilisateurs,
                (SELECT COUNT(*) FROM annonce)     AS total_annonces,
                (SELECT COUNT(*) FROM annonce WHERE statut = "active") AS total_annonces_actives,
                (SELECT COUNT(*) FROM annonce WHERE statut = "vendu")  AS total_annonces_vendues,
                (SELECT COUNT(*) FROM message)     AS total_messages,
                (SELECT COUNT(*) FROM avis_utilisateur) + (SELECT COUNT(*) FROM avis_modele) AS total_avis
        ')->fetch();

        return $row;
    }

    public function getAnnoncesParMarque(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT ma.nom AS marque_nom, COUNT(a.id_annonce) AS count
            FROM annonce a
            JOIN version v    ON v.id_version    = a.id_version
            JOIN generation g ON g.id_generation = v.id_generation
            JOIN modele mo    ON mo.id_modele    = g.id_modele
            JOIN marque ma    ON ma.id_marque    = mo.id_marque
            GROUP BY ma.id_marque
            ORDER BY count DESC
            LIMIT 10
        ');
        return $stmt->fetchAll();
    }

    public function getAnnoncesParMois(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT DATE_FORMAT(date_creation, "%Y-%m") AS mois,
                   DATE_FORMAT(date_creation, "%b %Y") AS mois_label,
                   COUNT(*) AS count
            FROM annonce
            WHERE date_creation >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY mois, mois_label
            ORDER BY mois ASC
        ');
        return $stmt->fetchAll();
    }

    public function getInscriptionsParMois(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT DATE_FORMAT(date_inscription, "%Y-%m") AS mois,
                   DATE_FORMAT(date_inscription, "%b %Y") AS mois_label,
                   COUNT(*) AS count
            FROM utilisateur
            WHERE date_inscription >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY mois, mois_label
            ORDER BY mois ASC
        ');
        return $stmt->fetchAll();
    }

    public function getPrixMoyenParMarqueAdmin(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT ma.nom AS marque_nom, ROUND(AVG(a.prix), 0) AS prix_moyen
            FROM annonce a
            JOIN version v    ON v.id_version    = a.id_version
            JOIN generation g ON g.id_generation = v.id_generation
            JOIN modele mo    ON mo.id_modele    = g.id_modele
            JOIN marque ma    ON ma.id_marque    = mo.id_marque
            GROUP BY ma.id_marque
            ORDER BY prix_moyen DESC
            LIMIT 10
        ');
        return $stmt->fetchAll();
    }

    public function getRepartitionCarburant(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT r.type AS carburant, COUNT(a.id_annonce) AS count
            FROM annonce a
            JOIN version v    ON v.id_version    = a.id_version
            LEFT JOIN reservoir r ON r.id_reservoir = v.id_reservoir
            WHERE r.type IS NOT NULL
            GROUP BY r.type
            ORDER BY count DESC
        ');
        return $stmt->fetchAll();
    }

    public function getRepartitionBoite(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT v.boite_vitesse, COUNT(a.id_annonce) AS count
            FROM annonce a
            JOIN version v ON v.id_version = a.id_version
            WHERE v.boite_vitesse IS NOT NULL
            GROUP BY v.boite_vitesse
            ORDER BY count DESC
        ');
        return $stmt->fetchAll();
    }

    public function getAnnoncesParStatut(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT statut, COUNT(*) AS count FROM annonce GROUP BY statut ORDER BY count DESC
        ');
        return $stmt->fetchAll();
    }

    public function getTopVendeurs(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT u.id_utilisateur, u.prenom, u.nom,
                COUNT(a.id_annonce) AS nb_annonces,
                COUNT(CASE WHEN a.statut = "vendu" THEN 1 END) AS nb_vendues,
                ROUND(AVG(a.prix), 0) AS prix_moyen
            FROM utilisateur u
            JOIN annonce a ON a.id_utilisateur = u.id_utilisateur
            GROUP BY u.id_utilisateur
            ORDER BY nb_annonces DESC
            LIMIT 8
        ');
        return $stmt->fetchAll();
    }

    public function getPrixMoyenGlobal(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT
                ROUND(AVG(prix), 0) AS prix_moyen_global,
                ROUND(AVG(kilometrage), 0) AS km_moyen
            FROM annonce
            WHERE statut = "active"
        ');
        return $stmt->fetch();
    }

    // ── STATS PRO ────────────────────────────────────────────────────────────

    public function getAnnoncesParMarquePro(int $userId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT ma.nom AS marque_nom, COUNT(a.id_annonce) AS count
            FROM annonce a
            JOIN version v    ON v.id_version    = a.id_version
            JOIN generation g ON g.id_generation = v.id_generation
            JOIN modele mo    ON mo.id_modele    = g.id_modele
            JOIN marque ma    ON ma.id_marque    = mo.id_marque
            WHERE a.id_utilisateur = :uid
            GROUP BY ma.id_marque ORDER BY count DESC LIMIT 10
        ');
        $stmt->execute(['uid' => $userId]);
        return $stmt->fetchAll();
    }

    public function getRepartitionStatutPro(int $userId): array
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT statut, COUNT(*) AS count FROM annonce WHERE id_utilisateur = :uid GROUP BY statut'
        );
        $stmt->execute(['uid' => $userId]);
        return $stmt->fetchAll();
    }

    public function getDerniersAvisPro(int $userId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT a.id_avis_utilisateur, a.note, a.contenu, a.date_avis,
                   COALESCE(NULLIF(u.username,""), CONCAT(u.prenom," ",u.nom)) AS redacteur_display,
                   u.nom AS redacteur_nom, u.prenom AS redacteur_prenom
            FROM avis_utilisateur a
            JOIN utilisateur u ON u.id_utilisateur = a.id_redacteur
            WHERE a.id_vendeur = :uid
            ORDER BY a.date_avis DESC LIMIT 5
        ');
        $stmt->execute(['uid' => $userId]);
        return $stmt->fetchAll();
    }

    public function getTopAnnoncesPro(int $userId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT a.id_annonce, a.prix, a.statut,
                   ma.nom AS marque_nom, mo.nom AS modele_nom, v.nom AS version_nom,
                   (SELECT url_photo FROM photo p WHERE p.id_annonce = a.id_annonce ORDER BY p.id_photo LIMIT 1) AS photo_principale,
                   (SELECT COUNT(*) FROM message m WHERE m.id_annonce = a.id_annonce) AS nb_messages,
                   (SELECT COUNT(*) FROM favorie f WHERE f.id_annonce = a.id_annonce) AS nb_favoris
            FROM annonce a
            JOIN version v    ON v.id_version    = a.id_version
            JOIN generation g ON g.id_generation = v.id_generation
            JOIN modele mo    ON mo.id_modele    = g.id_modele
            JOIN marque ma    ON ma.id_marque    = mo.id_marque
            WHERE a.id_utilisateur = :uid AND a.statut = "active"
            ORDER BY a.prix DESC LIMIT 5
        ');
        $stmt->execute(['uid' => $userId]);
        return $stmt->fetchAll();
    }

    public function getAnnoncesPro(int $userId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT a.id_annonce, a.prix, a.statut, a.date_publication, a.date_creation,
                   a.kilometrage, a.annee_circulation, a.commentaire_admin,
                   ma.nom AS marque_nom, mo.nom AS modele_nom, v.nom AS version_nom,
                   (SELECT url_photo FROM photo p WHERE p.id_annonce = a.id_annonce ORDER BY p.id_photo LIMIT 1) AS photo_principale,
                   (SELECT COUNT(*) FROM message m WHERE m.id_annonce = a.id_annonce AND m.id_destinataire = :uid) AS nb_messages,
                   (SELECT COUNT(*) FROM favorie f WHERE f.id_annonce = a.id_annonce) AS nb_favoris
            FROM annonce a
            JOIN version v    ON v.id_version    = a.id_version
            JOIN generation g ON g.id_generation = v.id_generation
            JOIN modele mo    ON mo.id_modele    = g.id_modele
            JOIN marque ma    ON ma.id_marque    = mo.id_marque
            WHERE a.id_utilisateur = :uid
            ORDER BY a.date_creation DESC
        ');
        $stmt->execute(['uid' => $userId]);
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
