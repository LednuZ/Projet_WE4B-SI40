<?php

namespace App\Repository;

use App\Service\DatabaseService;

class CatalogueAdminRepository
{
    public function __construct(private DatabaseService $db) {}

    // ── Marques ───────────────────────────────────────────────────────────────

    public function findAllMarques(): array
    {
        return $this->db->getConnection()->query(
            'SELECT id_marque, nom, pays, continent, date_creation, description, createur FROM marque ORDER BY nom'
        )->fetchAll();
    }

    public function createMarque(array $d): int
    {
        $this->db->getConnection()
            ->prepare('INSERT INTO marque (nom, pays, continent, date_creation, description, createur) VALUES (?,?,?,?,?,?)')
            ->execute([
                $d['nom'], $d['pays'] ?? null, $d['continent'] ?? null,
                ($d['date_creation'] ?? null) ?: null,
                $d['description'] ?? null, $d['createur'] ?? null,
            ]);
        return (int) $this->db->getConnection()->lastInsertId();
    }

    public function updateMarque(int $id, array $d): void
    {
        $this->db->getConnection()
            ->prepare('UPDATE marque SET nom=?, pays=?, continent=?, date_creation=?, description=?, createur=? WHERE id_marque=?')
            ->execute([
                $d['nom'], $d['pays'] ?? null, $d['continent'] ?? null,
                ($d['date_creation'] ?? null) ?: null,
                $d['description'] ?? null, $d['createur'] ?? null, $id,
            ]);
    }

    public function deleteMarque(int $id): void
    {
        $this->db->getConnection()
            ->prepare('DELETE FROM marque WHERE id_marque = ?')
            ->execute([$id]);
    }

    // ── Types ─────────────────────────────────────────────────────────────────

    public function findAllTypes(): array
    {
        return $this->db->getConnection()->query(
            'SELECT id_type, nom FROM type ORDER BY nom'
        )->fetchAll();
    }

    public function createType(string $nom): int
    {
        $this->db->getConnection()
            ->prepare('INSERT INTO type (nom) VALUES (?)')
            ->execute([$nom]);
        return (int) $this->db->getConnection()->lastInsertId();
    }

    public function updateType(int $id, string $nom): void
    {
        $this->db->getConnection()
            ->prepare('UPDATE type SET nom = ? WHERE id_type = ?')
            ->execute([$nom, $id]);
    }

    public function deleteType(int $id): void
    {
        $this->db->getConnection()
            ->prepare('DELETE FROM type WHERE id_type = ?')
            ->execute([$id]);
    }

    // ── Modèles ───────────────────────────────────────────────────────────────

    public function findAllModeles(): array
    {
        return $this->db->getConnection()->query('
            SELECT mo.id_modele, mo.nom, mo.annee_creation, mo.id_marque, mo.id_type,
                   ma.nom AS marque_nom, t.nom AS type_nom
            FROM modele mo
            JOIN marque ma ON ma.id_marque = mo.id_marque
            LEFT JOIN type t ON t.id_type = mo.id_type
            ORDER BY ma.nom, mo.nom
        ')->fetchAll();
    }

    public function createModele(string $nom, int $idMarque, ?int $idType, ?int $anneeCreation): int
    {
        $this->db->getConnection()
            ->prepare('INSERT INTO modele (nom, id_marque, id_type, annee_creation) VALUES (?, ?, ?, ?)')
            ->execute([$nom, $idMarque, $idType, $anneeCreation]);
        return (int) $this->db->getConnection()->lastInsertId();
    }

    public function updateModele(int $id, string $nom, int $idMarque, ?int $idType, ?int $anneeCreation): void
    {
        $this->db->getConnection()
            ->prepare('UPDATE modele SET nom = ?, id_marque = ?, id_type = ?, annee_creation = ? WHERE id_modele = ?')
            ->execute([$nom, $idMarque, $idType, $anneeCreation, $id]);
    }

    public function deleteModele(int $id): void
    {
        $this->db->getConnection()
            ->prepare('DELETE FROM modele WHERE id_modele = ?')
            ->execute([$id]);
    }

    // ── Réservoirs ────────────────────────────────────────────────────────────

    public function findAllReservoirs(): array
    {
        return $this->db->getConnection()->query('
            SELECT r.id_reservoir, r.volume, r.type, r.id_marque, ma.nom AS marque_nom
            FROM reservoir r LEFT JOIN marque ma ON ma.id_marque = r.id_marque
            ORDER BY r.type, r.volume
        ')->fetchAll();
    }

    public function createReservoir(array $d): int
    {
        $this->db->getConnection()
            ->prepare('INSERT INTO reservoir (volume, type, id_marque) VALUES (?,?,?)')
            ->execute([$d['volume'] ?: null, $d['type'] ?? null, ($d['id_marque'] ?? null) ?: null]);
        return (int) $this->db->getConnection()->lastInsertId();
    }

    public function updateReservoir(int $id, array $d): void
    {
        $this->db->getConnection()
            ->prepare('UPDATE reservoir SET volume=?, type=?, id_marque=? WHERE id_reservoir=?')
            ->execute([$d['volume'] ?: null, $d['type'] ?? null, ($d['id_marque'] ?? null) ?: null, $id]);
    }

    public function deleteReservoir(int $id): void
    {
        $this->db->getConnection()->prepare('DELETE FROM reservoir WHERE id_reservoir=?')->execute([$id]);
    }

    // ── Moteurs ───────────────────────────────────────────────────────────────

    public function findAllMoteurs(): array
    {
        return $this->db->getConnection()->query('
            SELECT m.id_moteur, m.nom, m.puissance_DIN, m.puissance_fiscale,
                   m.cylindree, m.couple_cumul, m.nombre_cylindre, m.nombre_soupapes_cyclindre,
                   m.alimentation, m.type_suralimentation, m.id_marque, ma.nom AS marque_nom
            FROM moteur m LEFT JOIN marque ma ON ma.id_marque = m.id_marque
            ORDER BY m.nom
        ')->fetchAll();
    }

    public function createMoteur(array $d): int
    {
        $this->db->getConnection()->prepare('
            INSERT INTO moteur (nom, puissance_DIN, puissance_fiscale, cylindree, couple_cumul,
                nombre_cylindre, nombre_soupapes_cyclindre, alimentation, type_suralimentation, id_marque)
            VALUES (?,?,?,?,?,?,?,?,?,?)
        ')->execute([
            $d['nom'], $d['puissance_DIN'] ?: null, $d['puissance_fiscale'] ?: null,
            $d['cylindree'] ?: null, $d['couple_cumul'] ?: null,
            $d['nombre_cylindre'] ?: null, $d['nombre_soupapes_cyclindre'] ?: null,
            $d['alimentation'] ?? null, $d['type_suralimentation'] ?? null,
            ($d['id_marque'] ?? null) ?: null,
        ]);
        return (int) $this->db->getConnection()->lastInsertId();
    }

    public function updateMoteur(int $id, array $d): void
    {
        $this->db->getConnection()->prepare('
            UPDATE moteur SET nom=?, puissance_DIN=?, puissance_fiscale=?, cylindree=?, couple_cumul=?,
                nombre_cylindre=?, nombre_soupapes_cyclindre=?, alimentation=?, type_suralimentation=?, id_marque=?
            WHERE id_moteur=?
        ')->execute([
            $d['nom'], $d['puissance_DIN'] ?: null, $d['puissance_fiscale'] ?: null,
            $d['cylindree'] ?: null, $d['couple_cumul'] ?: null,
            $d['nombre_cylindre'] ?: null, $d['nombre_soupapes_yclindre'] ?: null,
            $d['alimentation'] ?? null, $d['type_suralimentation'] ?? null,
            ($d['id_marque'] ?? null) ?: null, $id,
        ]);
    }

    public function deleteMoteur(int $id): void
    {
        $this->db->getConnection()->prepare('DELETE FROM moteur WHERE id_moteur=?')->execute([$id]);
    }

    // ── Coffres ───────────────────────────────────────────────────────────────

    public function findAllCoffres(): array
    {
        return $this->db->getConnection()->query(
            'SELECT id_coffre, volume FROM coffre ORDER BY volume'
        )->fetchAll();
    }

    public function createCoffre(int $volume): int
    {
        $this->db->getConnection()->prepare('INSERT INTO coffre (volume) VALUES (?)')->execute([$volume]);
        return (int) $this->db->getConnection()->lastInsertId();
    }

    public function updateCoffre(int $id, int $volume): void
    {
        $this->db->getConnection()->prepare('UPDATE coffre SET volume=? WHERE id_coffre=?')->execute([$volume, $id]);
    }

    public function deleteCoffre(int $id): void
    {
        $this->db->getConnection()->prepare('DELETE FROM coffre WHERE id_coffre=?')->execute([$id]);
    }

    // ── Versions ──────────────────────────────────────────────────────────────

    public function findAllVersions(): array
    {
        return $this->db->getConnection()->query('
            SELECT v.id_version, v.nom, v.transmission, v.boite_vitesse, v.nombre_rapport,
                   v.nombre_places, v.nombre_portes, v.vitesse_max,
                   v.consomation_mixte, v.emission_CO2, v.Norme_euro, v.Crit_air,
                   v.hauteur, v.empattement, v.poids_vide,
                   v.suspension_avant, v.suspension_arriere, v.freins_avant, v.freins_arriere,
                   v.id_generation, v.id_reservoir, v.id_coffre,
                   g.nom AS generation_nom, mo.nom AS modele_nom, ma.nom AS marque_nom
            FROM version v
            JOIN generation g ON g.id_generation = v.id_generation
            JOIN modele mo ON mo.id_modele = g.id_modele
            JOIN marque ma ON ma.id_marque = mo.id_marque
            ORDER BY ma.nom, mo.nom, g.nom, v.nom
        ')->fetchAll();
    }

    public function createVersion(array $d): int
    {
        $this->db->getConnection()->prepare('
            INSERT INTO version (nom, id_generation, id_reservoir, id_coffre,
                transmission, boite_vitesse, nombre_rapport, nombre_places, nombre_portes,
                vitesse_max, consomation_mixte, emission_CO2, Norme_euro, Crit_air,
                hauteur, empattement, poids_vide, suspension_avant, suspension_arriere,
                freins_avant, freins_arriere)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ')->execute($this->versionParams($d));
        return (int) $this->db->getConnection()->lastInsertId();
    }

    public function updateVersion(int $id, array $d): void
    {
        $params = $this->versionParams($d);
        $params[] = $id;
        $this->db->getConnection()->prepare('
            UPDATE version SET nom=?, id_generation=?, id_reservoir=?, id_coffre=?,
                transmission=?, boite_vitesse=?, nombre_rapport=?, nombre_places=?, nombre_portes=?,
                vitesse_max=?, consomation_mixte=?, emission_CO2=?, Norme_euro=?, Crit_air=?,
                hauteur=?, empattement=?, poids_vide=?, suspension_avant=?, suspension_arriere=?,
                freins_avant=?, freins_arriere=?
            WHERE id_version=?
        ')->execute($params);
    }

    private function versionParams(array $d): array
    {
        $n = fn($k) => isset($d[$k]) && $d[$k] !== '' ? $d[$k] : null;
        return [
            $d['nom'], (int)$d['id_generation'], $n('id_reservoir'), $n('id_coffre'),
            $n('transmission'), $n('boite_vitesse'), $n('nombre_rapport'),
            $n('nombre_places'), $n('nombre_portes'), $n('vitesse_max'),
            $n('consomation_mixte'), $n('emission_CO2'), $n('Norme_euro'), $n('Crit_air'),
            $n('hauteur'), $n('empattement'), $n('poids_vide'),
            $n('suspension_avant'), $n('suspension_arriere'), $n('freins_avant'), $n('freins_arriere'),
        ];
    }

    public function deleteVersion(int $id): void
    {
        $pdo = $this->db->getConnection();
        $pdo->prepare('DELETE FROM possession_moteur WHERE id_version=?')->execute([$id]);
        $pdo->prepare('DELETE FROM version WHERE id_version=?')->execute([$id]);
    }

    // ── Possession moteur (version ↔ moteur) ──────────────────────────────────

    public function getMoteursByVersion(int $versionId): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT m.id_moteur, m.nom, m.puissance_DIN, m.alimentation
            FROM possession_moteur pm JOIN moteur m ON m.id_moteur = pm.id_moteur
            WHERE pm.id_version = ?
        ');
        $stmt->execute([$versionId]);
        return $stmt->fetchAll();
    }

    public function addMoteurToVersion(int $versionId, int $moteurId): void
    {
        $this->db->getConnection()
            ->prepare('INSERT IGNORE INTO possession_moteur (id_version, id_moteur) VALUES (?,?)')
            ->execute([$versionId, $moteurId]);
    }

    public function removeMoteurFromVersion(int $versionId, int $moteurId): void
    {
        $this->db->getConnection()
            ->prepare('DELETE FROM possession_moteur WHERE id_version=? AND id_moteur=?')
            ->execute([$versionId, $moteurId]);
    }

    // ── Générations ───────────────────────────────────────────────────────────

    public function findAllGenerations(): array
    {
        return $this->db->getConnection()->query('
            SELECT g.id_generation, g.nom, g.date_sortie, g.id_modele,
                   mo.nom AS modele_nom, ma.nom AS marque_nom
            FROM generation g
            JOIN modele mo ON mo.id_modele = g.id_modele
            JOIN marque ma ON ma.id_marque = mo.id_marque
            ORDER BY ma.nom, mo.nom, g.date_sortie
        ')->fetchAll();
    }

    public function createGeneration(string $nom, int $idModele, ?string $dateSortie): int
    {
        $this->db->getConnection()
            ->prepare('INSERT INTO generation (nom, id_modele, date_sortie) VALUES (?, ?, ?)')
            ->execute([$nom, $idModele, $dateSortie ?: null]);
        return (int) $this->db->getConnection()->lastInsertId();
    }

    public function updateGeneration(int $id, string $nom, int $idModele, ?string $dateSortie): void
    {
        $this->db->getConnection()
            ->prepare('UPDATE generation SET nom = ?, id_modele = ?, date_sortie = ? WHERE id_generation = ?')
            ->execute([$nom, $idModele, $dateSortie ?: null, $id]);
    }

    public function deleteGeneration(int $id): void
    {
        $this->db->getConnection()
            ->prepare('DELETE FROM generation WHERE id_generation = ?')
            ->execute([$id]);
    }
}
