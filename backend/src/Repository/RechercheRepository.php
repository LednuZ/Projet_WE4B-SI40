<?php

namespace App\Repository;

use App\Service\DatabaseService;

class RechercheRepository
{
    public function __construct(private DatabaseService $db) {}

    public function enregistrerVisite(int $idAnnonce, ?int $idUtilisateur): void
    {
        $this->db->getConnection()->prepare(
            'INSERT INTO recherche (id_annonce, id_utilisateur, date_recherche) VALUES (?, ?, NOW())'
        )->execute([$idAnnonce, $idUtilisateur]);
    }

    public function countVisites(int $idAnnonce): int
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT COUNT(*) FROM recherche WHERE id_annonce = ?'
        );
        $stmt->execute([$idAnnonce]);
        return (int) $stmt->fetchColumn();
    }
}
