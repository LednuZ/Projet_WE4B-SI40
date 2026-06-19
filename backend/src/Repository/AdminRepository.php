<?php

namespace App\Repository;

use App\Service\DatabaseService;

class AdminRepository
{
    public function __construct(private DatabaseService $db) {}

    // ── Utilisateurs ─────────────────────────────────────────────────────────

    public function findAllUsers(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT u.id_utilisateur, u.nom, u.prenom, u.email, u.role, u.date_inscription,
                COUNT(a.id_annonce) AS nb_annonces
            FROM utilisateur u
            LEFT JOIN annonce a ON a.id_utilisateur = u.id_utilisateur
            GROUP BY u.id_utilisateur
            ORDER BY u.date_inscription DESC
        ');
        return $stmt->fetchAll();
    }

    public function updateRole(int $id, string $role): void
    {
        $this->db->getConnection()
            ->prepare('UPDATE utilisateur SET role = ? WHERE id_utilisateur = ?')
            ->execute([$role, $id]);
    }

    public function deleteUser(int $id): void
    {
        $this->db->getConnection()
            ->prepare('DELETE FROM utilisateur WHERE id_utilisateur = ?')
            ->execute([$id]);
    }

    // ── Annonces ─────────────────────────────────────────────────────────────

    public function findAllAnnonces(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT
                a.id_annonce, a.prix, a.statut, a.date_publication, a.date_creation,
                a.commentaire_admin, a.kilometrage, a.annee_circulation,
                ma.nom AS marque_nom, mo.nom AS modele_nom, v.nom AS version_nom,
                u.id_utilisateur AS vendeur_id,
                u.nom AS vendeur_nom, u.prenom AS vendeur_prenom
            FROM annonce a
            JOIN version v    ON v.id_version    = a.id_version
            JOIN generation g ON g.id_generation = v.id_generation
            JOIN modele mo    ON mo.id_modele    = g.id_modele
            JOIN marque ma    ON ma.id_marque    = mo.id_marque
            JOIN utilisateur u ON u.id_utilisateur = a.id_utilisateur
            ORDER BY a.date_creation DESC
        ');
        return $stmt->fetchAll();
    }

    public function updateStatutAnnonce(int $id, string $statut, ?string $commentaire): void
    {
        $this->db->getConnection()
            ->prepare('UPDATE annonce SET statut = ?, commentaire_admin = ? WHERE id_annonce = ?')
            ->execute([$statut, $commentaire, $id]);
    }

    public function deleteAnnonce(int $id): void
    {
        $pdo = $this->db->getConnection();
        $pdo->prepare('DELETE FROM photo   WHERE id_annonce = ?')->execute([$id]);
        $pdo->prepare('DELETE FROM message WHERE id_annonce = ?')->execute([$id]);
        $pdo->prepare('DELETE FROM favorie WHERE id_annonce = ?')->execute([$id]);
        $pdo->prepare('DELETE FROM annonce WHERE id_annonce = ?')->execute([$id]);
    }
}
