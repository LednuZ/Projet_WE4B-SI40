<?php

namespace App\Repository;

use App\Service\DatabaseService;

class AvisRepository
{
    public function __construct(private DatabaseService $db) {}

    public function findByVendeur(int $vendeurId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT
                a.id_avis_utilisateur,
                a.note,
                a.contenu,
                a.date_avis,
                u.id_utilisateur AS redacteur_id,
                u.nom            AS redacteur_nom,
                u.prenom         AS redacteur_prenom
            FROM avis_utilisateur a
            JOIN utilisateur u ON u.id_utilisateur = a.id_redacteur
            WHERE a.id_vendeur = :vid
            ORDER BY a.date_avis DESC
        ');
        $stmt->execute(['vid' => $vendeurId]);
        return $stmt->fetchAll();
    }

    public function getStats(int $vendeurId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT COUNT(*) AS nb_avis, ROUND(AVG(note), 1) AS note_moyenne
            FROM avis_utilisateur
            WHERE id_vendeur = :vid
        ');
        $stmt->execute(['vid' => $vendeurId]);
        return $stmt->fetch();
    }

    public function hasAlreadyReviewed(int $redacteurId, int $vendeurId): bool
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT 1 FROM avis_utilisateur
            WHERE id_redacteur = :rid AND id_vendeur = :vid
        ');
        $stmt->execute(['rid' => $redacteurId, 'vid' => $vendeurId]);
        return (bool) $stmt->fetch();
    }

    public function create(int $redacteurId, int $vendeurId, int $note, ?string $contenu): int
    {
        $stmt = $this->db->getConnection()->prepare('
            INSERT INTO avis_utilisateur (id_redacteur, id_vendeur, note, contenu, date_avis)
            VALUES (:rid, :vid, :note, :contenu, NOW())
        ');
        $stmt->execute([
            'rid'     => $redacteurId,
            'vid'     => $vendeurId,
            'note'    => $note,
            'contenu' => $contenu,
        ]);
        return (int) $this->db->getConnection()->lastInsertId();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT * FROM avis_utilisateur WHERE id_avis_utilisateur = :id'
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public function delete(int $id): void
    {
        $this->db->getConnection()->prepare(
            'DELETE FROM avis_utilisateur WHERE id_avis_utilisateur = :id'
        )->execute(['id' => $id]);
    }

    public function findByRedacteurVendeur(int $userId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT
                a.id_avis_utilisateur, a.note, a.contenu, a.date_avis,
                u.id_utilisateur AS vendeur_id,
                u.nom AS vendeur_nom, u.prenom AS vendeur_prenom
            FROM avis_utilisateur a
            JOIN utilisateur u ON u.id_utilisateur = a.id_vendeur
            WHERE a.id_redacteur = :uid
            ORDER BY a.date_avis DESC
        ');
        $stmt->execute(['uid' => $userId]);
        return $stmt->fetchAll();
    }

    public function findByRedacteurModele(int $userId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT
                am.id_avis_modele, am.note, am.contenu, am.date_avis,
                mo.id_modele, mo.nom AS modele_nom, ma.nom AS marque_nom
            FROM avis_modele am
            JOIN modele mo ON mo.id_modele = am.id_modele
            JOIN marque ma ON ma.id_marque = mo.id_marque
            WHERE am.id_redacteur = :uid
            ORDER BY am.date_avis DESC
        ');
        $stmt->execute(['uid' => $userId]);
        return $stmt->fetchAll();
    }

    public function findVendeur(int $id): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT id_utilisateur, nom, prenom FROM utilisateur WHERE id_utilisateur = :id'
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public function findVendeurPublic(int $id): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT id_utilisateur, nom, prenom, role, date_inscription
             FROM utilisateur WHERE id_utilisateur = :id'
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch() ?: null;
    }

    // ── Avis modèle ──────────────────────────────────────────────────────────

    public function findByModele(int $modeleId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT
                am.id_avis_modele,
                am.note,
                am.contenu,
                am.date_avis,
                u.id_utilisateur AS redacteur_id,
                u.nom            AS redacteur_nom,
                u.prenom         AS redacteur_prenom
            FROM avis_modele am
            JOIN utilisateur u ON u.id_utilisateur = am.id_redacteur
            WHERE am.id_modele = :mid
            ORDER BY am.date_avis DESC
        ');
        $stmt->execute(['mid' => $modeleId]);
        return $stmt->fetchAll();
    }

    public function getStatsModele(int $modeleId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT COUNT(*) AS nb_avis, ROUND(AVG(note), 1) AS note_moyenne
            FROM avis_modele
            WHERE id_modele = :mid
        ');
        $stmt->execute(['mid' => $modeleId]);
        return $stmt->fetch();
    }

    public function hasAlreadyReviewedModele(int $userId, int $modeleId): bool
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT 1 FROM avis_modele
            WHERE id_redacteur = :uid AND id_modele = :mid
        ');
        $stmt->execute(['uid' => $userId, 'mid' => $modeleId]);
        return (bool) $stmt->fetch();
    }

    public function createModele(int $userId, int $modeleId, int $note, ?string $contenu): void
    {
        $this->db->getConnection()->prepare('
            INSERT INTO avis_modele (id_redacteur, id_modele, note, contenu, date_avis)
            VALUES (:uid, :mid, :note, :contenu, NOW())
        ')->execute([
            'uid'     => $userId,
            'mid'     => $modeleId,
            'note'    => $note,
            'contenu' => $contenu,
        ]);
    }

    public function findModeleAvisById(int $id): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT * FROM avis_modele WHERE id_avis_modele = :id'
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public function deleteModele(int $id): void
    {
        $this->db->getConnection()->prepare(
            'DELETE FROM avis_modele WHERE id_avis_modele = :id'
        )->execute(['id' => $id]);
    }
}
