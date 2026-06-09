<?php

namespace App\Repository;

use App\Service\DatabaseService;

class AdminRepository
{
    public function __construct(private DatabaseService $db) {}

    public function findAllUsers(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT u.id_utilisateur, u.nom, u.prenom, u.email, u.role, u.numero_phone, u.date_inscription,
                COUNT(a.id_annonce) AS nb_annonces
            FROM utilisateur u
            LEFT JOIN annonce a ON a.id_utilisateur = u.id_utilisateur
            GROUP BY u.id_utilisateur
            ORDER BY u.date_inscription DESC
        ');
        return $stmt->fetchAll();
    }

    public function deleteUser(int $id): void
    {
        // Les FK ON DELETE CASCADE gèrent automatiquement : annonces, photos, messages, favoris, avis, recherches
        $this->db->getConnection()
            ->prepare('DELETE FROM utilisateur WHERE id_utilisateur = ?')
            ->execute([$id]);
    }
}
