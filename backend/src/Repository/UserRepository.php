<?php

namespace App\Repository;

use App\Service\DatabaseService;

class UserRepository
{
    public function __construct(private DatabaseService $db) {}

    public function findById(int $id): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT id_utilisateur, nom, prenom, role, date_inscription,
                    (SELECT AVG(note) FROM avis_utilisateur au WHERE au.id_vendeur = utilisateur.id_utilisateur) AS rating
             FROM utilisateur
             WHERE id_utilisateur = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function findReviews(int $userId): array
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT au.*, u.prenom, u.nom
             FROM avis_utilisateur au
             JOIN utilisateur u ON au.id_redacteur = u.id_utilisateur
             WHERE au.id_vendeur = ?
             ORDER BY au.date_avis DESC'
        );
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    /** Full profile for the account owner (includes email + phone). */
    public function findByIdFull(int $id): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT id_utilisateur, nom, prenom, email, numero_phone, role, date_inscription
             FROM utilisateur WHERE id_utilisateur = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function updateProfile(int $id, string $nom, string $prenom, string $email, ?string $phone): void
    {
        $stmt = $this->db->getConnection()->prepare(
            'UPDATE utilisateur SET nom = ?, prenom = ?, email = ?, numero_phone = ? WHERE id_utilisateur = ?'
        );
        $stmt->execute([$nom, $prenom, $email, $phone, $id]);
    }

    public function updatePassword(int $id, string $hashedPassword): void
    {
        $stmt = $this->db->getConnection()->prepare(
            'UPDATE utilisateur SET mdp = ? WHERE id_utilisateur = ?'
        );
        $stmt->execute([$hashedPassword, $id]);
    }

    public function delete(int $id): void
    {
        $pdo = $this->db->getConnection();
        // Cascade delete: avis, messages, favoris, photos+annonces
        $pdo->prepare('DELETE FROM avis_utilisateur WHERE id_vendeur = ? OR id_redacteur = ?')->execute([$id, $id]);
        $pdo->prepare('DELETE FROM message WHERE id_expediteur = ? OR id_destinataire = ?')->execute([$id, $id]);
        $pdo->prepare('DELETE FROM favori WHERE id_utilisateur = ?')->execute([$id]);
        // Photos of user's annonces
        $pdo->prepare('DELETE p FROM photo p JOIN annonce a ON p.id_annonce = a.id_annonce WHERE a.id_utilisateur = ?')->execute([$id]);
        $pdo->prepare('DELETE FROM annonce WHERE id_utilisateur = ?')->execute([$id]);
        $pdo->prepare('DELETE FROM utilisateur WHERE id_utilisateur = ?')->execute([$id]);
    }
}
