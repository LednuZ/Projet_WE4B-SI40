<?php

namespace App\Repository;

use App\Service\DatabaseService;

class MessagerieRepository
{
    public function __construct(private DatabaseService $db) {}

    public function findConversations(int $userId): array
    {
        $sql = '
            SELECT
                u.id_utilisateur AS interlocuteur_id,
                u.nom,
                u.prenom,
                u.email,
                m_last.contenu      AS dernier_message,
                m_last.date_envoi   AS date_dernier_message,
                m_last.id_annonce,
                CONCAT(ma.nom, " ", mo.nom) AS annonce_titre,
                COALESCE(unread.nb, 0) = 0  AS lu
            FROM utilisateur u
            JOIN (
                SELECT
                    CASE WHEN id_expediteur = :uid THEN id_destinataire ELSE id_expediteur END AS interlocuteur,
                    id_annonce,
                    MAX(id_message) AS last_id
                FROM message
                WHERE id_expediteur = :uid OR id_destinataire = :uid
                GROUP BY interlocuteur, id_annonce
            ) conv ON conv.interlocuteur = u.id_utilisateur
            JOIN message m_last ON m_last.id_message = conv.last_id
            JOIN annonce a   ON a.id_annonce = conv.id_annonce
            JOIN version v   ON v.id_version = a.id_version
            JOIN generation g ON g.id_generation = v.id_generation
            JOIN modele mo   ON mo.id_modele = g.id_modele
            JOIN marque ma   ON ma.id_marque = mo.id_marque
            LEFT JOIN (
                SELECT id_expediteur, id_annonce, COUNT(*) AS nb
                FROM message
                WHERE id_destinataire = :uid AND lu = 0
                GROUP BY id_expediteur, id_annonce
            ) unread ON unread.id_expediteur = u.id_utilisateur AND unread.id_annonce = conv.id_annonce
            ORDER BY m_last.date_envoi DESC
        ';

        $stmt = $this->db->getConnection()->prepare($sql);
        $stmt->execute(['uid' => $userId]);
        return $stmt->fetchAll();
    }

    public function findMessages(int $userId, int $interlocuteurId, int $idAnnonce): array
    {
        $sql = '
            SELECT id_message, id_expediteur, id_destinataire, contenu, date_envoi, lu
            FROM message
            WHERE id_annonce = :ann
              AND ((id_expediteur = :uid AND id_destinataire = :iid)
               OR  (id_expediteur = :iid AND id_destinataire = :uid))
            ORDER BY date_envoi ASC
        ';

        $stmt = $this->db->getConnection()->prepare($sql);
        $stmt->execute(['uid' => $userId, 'iid' => $interlocuteurId, 'ann' => $idAnnonce]);
        return $stmt->fetchAll();
    }

    public function findUtilisateur(int $id): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT id_utilisateur, nom, prenom, email FROM utilisateur WHERE id_utilisateur = :id'
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public function envoyer(int $expediteurId, int $destinataireId, int $idAnnonce, string $contenu): void
    {
        $stmt = $this->db->getConnection()->prepare(
            'INSERT INTO message (id_expediteur, id_destinataire, id_annonce, contenu, date_envoi, lu)
             VALUES (:exp, :dest, :ann, :contenu, NOW(), 0)'
        );
        $stmt->execute([
            'exp'     => $expediteurId,
            'dest'    => $destinataireId,
            'ann'     => $idAnnonce,
            'contenu' => $contenu,
        ]);
    }

    public function marquerLus(int $expediteurId, int $destinataireId, int $idAnnonce): void
    {
        $stmt = $this->db->getConnection()->prepare(
            'UPDATE message SET lu = 1
             WHERE id_expediteur = :exp AND id_destinataire = :dest AND id_annonce = :ann AND lu = 0'
        );
        $stmt->execute(['exp' => $expediteurId, 'dest' => $destinataireId, 'ann' => $idAnnonce]);
    }

    /**
     * Compte le nombre total de messages non lus pour un utilisateur.
     * Utilisé pour le badge de notification dans le header.
     */
    public function countUnreadMessages(int $userId): int
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT COUNT(*) FROM message WHERE id_destinataire = :uid AND lu = 0'
        );
        $stmt->execute(['uid' => $userId]);
        return (int) $stmt->fetchColumn();
    }
}
