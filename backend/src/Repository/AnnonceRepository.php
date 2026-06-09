<?php

namespace App\Repository;

use App\Service\DatabaseService;

class AnnonceRepository
{
    private const BASE_SELECT = '
        SELECT
            a.id_annonce, a.prix, a.annee_circulation, a.kilometrage,
            a.etat, a.couleur, a.sellerie, a.finition, a.provenance,
            a.localisation, a.statut, a.description,
            a.premiere_main, a.nombre_proprietaire, a.controle_technique,
            a.date_publication, a.date_creation, a.date_vente,
            v.id_version, v.nom AS version_nom,
            v.transmission, v.boite_vitesse, v.nombre_places, v.nombre_portes, v.nombre_rapport,
            v.vitesse_max,
            v.consommation_urbaine, v.consommation_extra_urbaine, v.consomation_mixte,
            v.emission_CO2, v.Norme_euro, v.Crit_air,
            v.largeur_sans_retros, v.hauteur, v.empattement, v.poids_vide,
            v.suspension_avant, v.suspension_arriere, v.freins_avant, v.freins_arriere,
            v.diametre_braquage,
            r.type AS carburant, r.volume AS reservoir_volume,
            co.volume AS coffre_volume,
            mot.moteur_nom, mot.puissance_DIN, mot.puissance_fiscale, mot.cylindree,
            mot.couple_cumul, mot.nombre_cylindre, mot.nombre_soupapes_cyclindre,
            mot.alimentation, mot.type_suralimentation,
            g.id_generation, g.nom AS generation_nom, g.date_sortie AS generation_date_sortie,
            mo.id_modele, mo.nom AS modele_nom, mo.annee_creation AS modele_annee,
            t.nom AS type_nom,
            ma.id_marque, ma.nom AS marque_nom, ma.pays AS marque_pays,
            u.id_utilisateur AS vendeur_id, u.prenom AS vendeur_prenom, u.nom AS vendeur_nom,
            (SELECT url_photo FROM photo p WHERE p.id_annonce = a.id_annonce ORDER BY p.id_photo LIMIT 1) AS photo_principale,
            (SELECT ROUND(AVG(au.note), 1) FROM avis_utilisateur au WHERE au.id_vendeur = u.id_utilisateur) AS vendeur_note
        FROM annonce a
        JOIN version v ON a.id_version = v.id_version
        LEFT JOIN reservoir r ON r.id_reservoir = v.id_reservoir
        LEFT JOIN coffre co ON co.id_coffre = v.id_coffre
        LEFT JOIN (
            SELECT pm.id_version,
                MIN(m.nom) AS moteur_nom,
                MIN(m.puissance_DIN) AS puissance_DIN,
                MIN(m.puissance_fiscale) AS puissance_fiscale,
                MIN(m.cylindree) AS cylindree,
                MIN(m.couple_cumul) AS couple_cumul,
                MIN(m.nombre_cylindre) AS nombre_cylindre,
                MIN(m.nombre_soupapes_cyclindre) AS nombre_soupapes_cyclindre,
                MIN(m.alimentation) AS alimentation,
                MIN(m.type_suralimentation) AS type_suralimentation
            FROM possession_moteur pm
            JOIN moteur m ON m.id_moteur = pm.id_moteur
            GROUP BY pm.id_version
        ) mot ON mot.id_version = v.id_version
        JOIN generation g ON v.id_generation = g.id_generation
        JOIN modele mo ON g.id_modele = mo.id_modele
        LEFT JOIN type t ON t.id_type = mo.id_type
        JOIN marque ma ON mo.id_marque = ma.id_marque
        JOIN utilisateur u ON a.id_utilisateur = u.id_utilisateur
    ';

    private const BASE_SELECT_ADMIN = '
        SELECT
            a.id_annonce, a.prix, a.annee_circulation, a.kilometrage,
            a.etat, a.couleur, a.sellerie, a.finition, a.provenance,
            a.localisation, a.statut, a.commentaire_admin, a.description,
            a.premiere_main, a.nombre_proprietaire, a.controle_technique,
            a.date_publication, a.date_creation, a.date_vente,
            v.id_version, v.nom AS version_nom,
            v.transmission, v.boite_vitesse, v.nombre_places, v.nombre_portes, v.nombre_rapport,
            v.vitesse_max,
            v.consommation_urbaine, v.consommation_extra_urbaine, v.consomation_mixte,
            v.emission_CO2, v.Norme_euro, v.Crit_air,
            v.largeur_sans_retros, v.hauteur, v.empattement, v.poids_vide,
            v.suspension_avant, v.suspension_arriere, v.freins_avant, v.freins_arriere,
            v.diametre_braquage,
            r.type AS carburant, r.volume AS reservoir_volume,
            co.volume AS coffre_volume,
            mot.moteur_nom, mot.puissance_DIN, mot.puissance_fiscale, mot.cylindree,
            mot.couple_cumul, mot.nombre_cylindre, mot.nombre_soupapes_cyclindre,
            mot.alimentation, mot.type_suralimentation,
            g.id_generation, g.nom AS generation_nom, g.date_sortie AS generation_date_sortie,
            mo.id_modele, mo.nom AS modele_nom, mo.annee_creation AS modele_annee,
            t.nom AS type_nom,
            ma.id_marque, ma.nom AS marque_nom, ma.pays AS marque_pays,
            u.id_utilisateur AS vendeur_id, u.prenom AS vendeur_prenom, u.nom AS vendeur_nom, u.numero_phone AS vendeur_phone,
            (SELECT url_photo FROM photo p WHERE p.id_annonce = a.id_annonce ORDER BY p.id_photo LIMIT 1) AS photo_principale
        FROM annonce a
        JOIN version v ON a.id_version = v.id_version
        LEFT JOIN reservoir r ON r.id_reservoir = v.id_reservoir
        LEFT JOIN coffre co ON co.id_coffre = v.id_coffre
        LEFT JOIN (
            SELECT pm.id_version,
                MIN(m.nom) AS moteur_nom,
                MIN(m.puissance_DIN) AS puissance_DIN,
                MIN(m.puissance_fiscale) AS puissance_fiscale,
                MIN(m.cylindree) AS cylindree,
                MIN(m.couple_cumul) AS couple_cumul,
                MIN(m.nombre_cylindre) AS nombre_cylindre,
                MIN(m.nombre_soupapes_cyclindre) AS nombre_soupapes_cyclindre,
                MIN(m.alimentation) AS alimentation,
                MIN(m.type_suralimentation) AS type_suralimentation
            FROM possession_moteur pm
            JOIN moteur m ON m.id_moteur = pm.id_moteur
            GROUP BY pm.id_version
        ) mot ON mot.id_version = v.id_version
        JOIN generation g ON v.id_generation = g.id_generation
        JOIN modele mo ON g.id_modele = mo.id_modele
        LEFT JOIN type t ON t.id_type = mo.id_type
        JOIN marque ma ON mo.id_marque = ma.id_marque
        JOIN utilisateur u ON a.id_utilisateur = u.id_utilisateur
    ';

    public function __construct(private DatabaseService $db) {}

    public function findAll(array $filters = [], string $sort = 'recent'): array
    {
        $where  = ['a.statut = ?'];
        $params = ['active'];

        if (!empty($filters['marque_id'])) {
            $where[]  = 'ma.id_marque = ?';
            $params[] = (int) $filters['marque_id'];
        }
        if (!empty($filters['modele_id'])) {
            $where[]  = 'mo.id_modele = ?';
            $params[] = (int) $filters['modele_id'];
        }
        if (!empty($filters['prix_min'])) {
            $where[]  = 'a.prix >= ?';
            $params[] = (float) $filters['prix_min'];
        }
        if (!empty($filters['prix_max'])) {
            $where[]  = 'a.prix <= ?';
            $params[] = (float) $filters['prix_max'];
        }
        if (!empty($filters['km_max'])) {
            $where[]  = 'a.kilometrage <= ?';
            $params[] = (int) $filters['km_max'];
        }
        if (!empty($filters['annee_min'])) {
            $where[]  = 'a.annee_circulation >= ?';
            $params[] = (int) $filters['annee_min'];
        }
        if (!empty($filters['annee_max'])) {
            $where[]  = 'a.annee_circulation <= ?';
            $params[] = (int) $filters['annee_max'];
        }
        if (!empty($filters['vendeur_id'])) {
            $where[]  = 'a.id_utilisateur = ?';
            $params[] = (int) $filters['vendeur_id'];
        }

        // Tri
        $orderBy = match ($sort) {
            'price_asc'    => 'a.prix ASC',
            'price_desc'   => 'a.prix DESC',
            'rating_desc'  => 'vendeur_note DESC, a.date_publication DESC',
            'km_asc'       => 'a.kilometrage ASC',
            default        => 'a.date_publication DESC, a.date_creation DESC',
        };

        $sql  = self::BASE_SELECT . ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY ' . $orderBy;

        $stmt = $this->db->getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            self::BASE_SELECT . ' WHERE a.id_annonce = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function findPhotos(int $idAnnonce): array
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT id_photo, url_photo FROM photo WHERE id_annonce = ? ORDER BY id_photo'
        );
        $stmt->execute([$idAnnonce]);
        return $stmt->fetchAll();
    }

    public function findByVendeur(int $idUser): array
    {
        // Inclut active + pause pour que le vendeur voie ses annonces suspendues
        $sql  = self::BASE_SELECT_ADMIN . ' WHERE a.id_utilisateur = ?';
        $sql .= ' ORDER BY a.date_creation DESC';
        $stmt = $this->db->getConnection()->prepare($sql);
        $stmt->execute([$idUser]);
        return $stmt->fetchAll();
    }

    public function findAllAdmin(array $filters = []): array
    {
        $where  = ['1=1'];
        $params = [];

        if (!empty($filters['statut'])) {
            $where[]  = 'a.statut = ?';
            $params[] = $filters['statut'];
        }
        if (!empty($filters['marque_id'])) {
            $where[]  = 'ma.id_marque = ?';
            $params[] = (int) $filters['marque_id'];
        }
        if (!empty($filters['search'])) {
            $where[]  = '(ma.nom LIKE ? OR mo.nom LIKE ? OR u.nom LIKE ? OR u.prenom LIKE ?)';
            $s        = '%' . $filters['search'] . '%';
            $params   = array_merge($params, [$s, $s, $s, $s]);
        }

        $sql  = self::BASE_SELECT_ADMIN . ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY a.date_creation DESC';

        $stmt = $this->db->getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function updateStatut(int $id, string $statut, ?string $commentaire = null): void
    {
        $stmt = $this->db->getConnection()->prepare(
            'UPDATE annonce SET statut = ?, commentaire_admin = ? WHERE id_annonce = ?'
        );
        $stmt->execute([$statut, $commentaire, $id]);
    }

    public function create(array $data): int
    {
        $pdo  = $this->db->getConnection();
        $stmt = $pdo->prepare('
            INSERT INTO annonce
                (id_utilisateur, id_version, prix, annee_circulation, kilometrage,
                 etat, couleur, sellerie, finition, provenance,
                 premiere_main, nombre_proprietaire, controle_technique,
                 localisation, description, statut, date_publication)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ');
        $stmt->execute([
            $data['id_utilisateur'],
            $data['id_version'],
            $data['prix'],
            $data['annee_circulation'],
            $data['kilometrage'],
            $data['etat'] ?: null,
            $data['couleur'] ?: null,
            $data['sellerie'] ?: null,
            $data['finition'] ?: null,
            $data['provenance'] ?: null,
            $data['premiere_main'] ? 1 : 0,
            $data['nombre_proprietaire'] ?: null,
            $data['controle_technique'] ?: null,
            $data['localisation'] ?: null,
            $data['description'] ?: null,
            'active',
        ]);
        return (int) $pdo->lastInsertId();
    }

    public function update(int $id, array $data): void
    {
        $stmt = $this->db->getConnection()->prepare('
            UPDATE annonce SET
                id_version = ?, prix = ?, annee_circulation = ?, kilometrage = ?,
                etat = ?, couleur = ?, sellerie = ?, finition = ?, provenance = ?,
                premiere_main = ?, nombre_proprietaire = ?,
                controle_technique = ?, localisation = ?, description = ?
            WHERE id_annonce = ?
        ');
        $stmt->execute([
            $data['id_version'],
            $data['prix'],
            $data['annee_circulation'],
            $data['kilometrage'],
            $data['etat'] ?: null,
            $data['couleur'] ?: null,
            $data['sellerie'] ?: null,
            $data['finition'] ?: null,
            $data['provenance'] ?: null,
            $data['premiere_main'] ? 1 : 0,
            $data['nombre_proprietaire'] ?: null,
            $data['controle_technique'] ?: null,
            $data['localisation'] ?: null,
            $data['description'] ?: null,
            $id,
        ]);
    }

    public function delete(int $id): void
    {
        $stmt = $this->db->getConnection()->prepare(
            'DELETE FROM annonce WHERE id_annonce = ?'
        );
        $stmt->execute([$id]);
    }

    public function getOwner(int $idAnnonce): ?int
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT id_utilisateur FROM annonce WHERE id_annonce = ?'
        );
        $stmt->execute([$idAnnonce]);
        $row = $stmt->fetch();
        return $row ? (int) $row['id_utilisateur'] : null;
    }

    public function addPhoto(int $idAnnonce, string $urlPhoto): void
    {
        $stmt = $this->db->getConnection()->prepare(
            'INSERT INTO photo (id_annonce, url_photo) VALUES (?, ?)'
        );
        $stmt->execute([$idAnnonce, $urlPhoto]);
    }

    public function deletePhoto(int $idPhoto): void
    {
        $stmt = $this->db->getConnection()->prepare(
            'DELETE FROM photo WHERE id_photo = ?'
        );
        $stmt->execute([$idPhoto]);
    }

    public function deletePhotos(int $idAnnonce): void
    {
        $stmt = $this->db->getConnection()->prepare(
            'DELETE FROM photo WHERE id_annonce = ?'
        );
        $stmt->execute([$idAnnonce]);
    }

    public function marquerVendu(int $id): void
    {
        $this->db->getConnection()
            ->prepare('UPDATE annonce SET statut = "vendu", date_vente = NOW() WHERE id_annonce = ?')
            ->execute([$id]);
    }
}
