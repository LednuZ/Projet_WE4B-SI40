<?php

namespace App\Repository;

use App\Service\DatabaseService;

class FavorisRepository
{
    private const BASE_SELECT = '
        SELECT
            a.id_annonce, a.prix, a.annee_circulation, a.kilometrage,
            a.etat, a.couleur, a.premiere_main, a.localisation, a.statut,
            v.nom AS version_nom, v.transmission, v.boite_vitesse, v.nombre_places,
            r.type AS carburant,
            mo.nom AS modele_nom,
            t.nom  AS type_nom,
            ma.nom AS marque_nom,
            COALESCE(NULLIF(u.username,""), CONCAT(u.prenom," ",u.nom)) AS vendeur_display,
            u.prenom AS vendeur_prenom, u.nom AS vendeur_nom,
            (SELECT ROUND(AVG(au.note), 1) FROM avis_utilisateur au WHERE au.id_vendeur = u.id_utilisateur) AS vendeur_note,
            (SELECT url_photo FROM photo p WHERE p.id_annonce = a.id_annonce ORDER BY p.id_photo LIMIT 1) AS photo_principale,
            f.date_ajout
        FROM favorie f
        JOIN annonce    a   ON a.id_annonce    = f.id_annonce
        JOIN version    v   ON v.id_version    = a.id_version
        LEFT JOIN reservoir r ON r.id_reservoir = v.id_reservoir
        JOIN generation g   ON g.id_generation = v.id_generation
        JOIN modele     mo  ON mo.id_modele    = g.id_modele
        LEFT JOIN type  t   ON t.id_type       = mo.id_type
        JOIN marque     ma  ON ma.id_marque    = mo.id_marque
        JOIN utilisateur u  ON u.id_utilisateur = a.id_utilisateur
    ';

    public function __construct(private DatabaseService $db) {}

    public function findByUser(int $userId): array
    {
        $stmt = $this->db->getConnection()->prepare(
            self::BASE_SELECT . ' WHERE f.id_utilisateur = :uid AND a.statut = \'active\' ORDER BY f.date_ajout DESC'
        );
        $stmt->execute(['uid' => $userId]);
        return $stmt->fetchAll();
    }

    public function getUserFavorisIds(int $userId): array
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT id_annonce FROM favorie WHERE id_utilisateur = :uid'
        );
        $stmt->execute(['uid' => $userId]);
        return array_column($stmt->fetchAll(), 'id_annonce');
    }

    public function add(int $userId, int $idAnnonce): void
    {
        if ($this->isFavori($userId, $idAnnonce)) return;
        $this->db->getConnection()->prepare(
            'INSERT INTO favorie (id_utilisateur, id_annonce, date_ajout) VALUES (:uid, :ann, NOW())'
        )->execute(['uid' => $userId, 'ann' => $idAnnonce]);
    }

    public function remove(int $userId, int $idAnnonce): void
    {
        $this->db->getConnection()->prepare(
            'DELETE FROM favorie WHERE id_utilisateur = :uid AND id_annonce = :ann'
        )->execute(['uid' => $userId, 'ann' => $idAnnonce]);
    }

    public function isFavori(int $userId, int $idAnnonce): bool
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT 1 FROM favorie WHERE id_utilisateur = :uid AND id_annonce = :ann'
        );
        $stmt->execute(['uid' => $userId, 'ann' => $idAnnonce]);
        return (bool) $stmt->fetch();
    }
}
