<?php

namespace App\Repository;

use App\Service\DatabaseService;

class CatalogueRepository
{
    public function __construct(private DatabaseService $db) {}

    // ── TYPES ─────────────────────────────────────────────────────────────────

    public function findAllTypes(): array
    {
        return $this->db->getConnection()->query(
            'SELECT id_type, nom FROM type ORDER BY nom'
        )->fetchAll();
    }

    // ── MARQUES ──────────────────────────────────────────────────────────────

    public function findAllMarques(): array
    {
        return $this->db->getConnection()->query('
            SELECT ma.id_marque, ma.nom, ma.pays, ma.continent, ma.date_creation,
                COUNT(DISTINCT mo.id_modele) AS nb_modeles
            FROM marque ma
            LEFT JOIN modele mo ON mo.id_marque = ma.id_marque
            GROUP BY ma.id_marque
            ORDER BY ma.nom
        ')->fetchAll();
    }

    public function findMarqueById(int $id): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT id_marque, nom, continent, pays, date_creation, description, createur FROM marque WHERE id_marque = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function createMarque(string $nom, ?string $continent, ?string $pays, ?int $dateCreation, ?string $description, ?string $createur): int
    {
        $pdo  = $this->db->getConnection();
        $stmt = $pdo->prepare('INSERT INTO marque (nom, continent, pays, date_creation, description, createur) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([trim($nom), $continent ?: null, $pays ?: null, $dateCreation ?: null, $description ?: null, $createur ?: null]);
        return (int) $pdo->lastInsertId();
    }

    public function deleteMarque(int $id): bool
    {
        $count = $this->db->getConnection()->prepare('SELECT COUNT(*) FROM modele WHERE id_marque = ?');
        $count->execute([$id]);
        if ((int) $count->fetchColumn() > 0) {
            return false;
        }
        $this->db->getConnection()->prepare('DELETE FROM marque WHERE id_marque = ?')->execute([$id]);
        return true;
    }

    // ── MODELES ──────────────────────────────────────────────────────────────

    public function findModelesByMarque(int $idMarque): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT mo.id_modele, mo.nom, mo.id_marque, mo.id_type, mo.annee_creation,
                t.nom AS type_nom,
                COUNT(DISTINCT g.id_generation) AS nb_generations
            FROM modele mo
            LEFT JOIN type t ON t.id_type = mo.id_type
            LEFT JOIN generation g ON g.id_modele = mo.id_modele
            WHERE mo.id_marque = ?
            GROUP BY mo.id_modele
            ORDER BY mo.nom
        ');
        $stmt->execute([$idMarque]);
        return $stmt->fetchAll();
    }

    public function findModeleById(int $id): ?array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT mo.id_modele, mo.nom, mo.id_marque, mo.id_type, mo.annee_creation,
                ma.nom AS marque_nom, t.nom AS type_nom
            FROM modele mo
            JOIN marque ma ON mo.id_marque = ma.id_marque
            LEFT JOIN type t ON t.id_type = mo.id_type
            WHERE mo.id_modele = ?
        ');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function createModele(int $idMarque, string $nom, int $idType, ?int $anneeCreation): int
    {
        $pdo  = $this->db->getConnection();
        $stmt = $pdo->prepare('INSERT INTO modele (id_marque, id_type, nom, annee_creation) VALUES (?, ?, ?, ?)');
        $stmt->execute([$idMarque, $idType, trim($nom), $anneeCreation ?: null]);
        return (int) $pdo->lastInsertId();
    }

    public function deleteModele(int $id): bool
    {
        $count = $this->db->getConnection()->prepare('SELECT COUNT(*) FROM generation WHERE id_modele = ?');
        $count->execute([$id]);
        if ((int) $count->fetchColumn() > 0) {
            return false;
        }
        $this->db->getConnection()->prepare('DELETE FROM modele WHERE id_modele = ?')->execute([$id]);
        return true;
    }

    // ── GENERATIONS ──────────────────────────────────────────────────────────

    public function findGenerationsByModele(int $idModele): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT g.id_generation, g.nom, g.date_sortie, g.id_modele,
                COUNT(v.id_version) AS nb_versions
            FROM generation g
            LEFT JOIN version v ON v.id_generation = g.id_generation
            WHERE g.id_modele = ?
            GROUP BY g.id_generation
            ORDER BY g.date_sortie, g.nom
        ');
        $stmt->execute([$idModele]);
        return $stmt->fetchAll();
    }

    public function findGenerationById(int $id): ?array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT g.id_generation, g.nom AS generation_nom, g.date_sortie, g.id_modele,
                mo.nom AS modele_nom, mo.id_marque, ma.nom AS marque_nom
            FROM generation g
            JOIN modele mo ON g.id_modele = mo.id_modele
            JOIN marque ma ON mo.id_marque = ma.id_marque
            WHERE g.id_generation = ?
        ');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function createGeneration(int $idModele, string $nom, ?string $dateSortie): int
    {
        $pdo  = $this->db->getConnection();
        $stmt = $pdo->prepare('INSERT INTO generation (id_modele, nom, date_sortie) VALUES (?, ?, ?)');
        $stmt->execute([$idModele, trim($nom), $dateSortie ?: null]);
        return (int) $pdo->lastInsertId();
    }

    public function deleteGeneration(int $id): bool
    {
        $count = $this->db->getConnection()->prepare('SELECT COUNT(*) FROM version WHERE id_generation = ?');
        $count->execute([$id]);
        if ((int) $count->fetchColumn() > 0) {
            return false;
        }
        $this->db->getConnection()->prepare('DELETE FROM generation WHERE id_generation = ?')->execute([$id]);
        return true;
    }

    // ── VERSIONS ─────────────────────────────────────────────────────────────

    public function findVersionsByGeneration(int $idGeneration): array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT v.id_version, v.nom, v.transmission, v.boite_vitesse, v.nombre_places, v.nombre_portes,
                v.vitesse_max, v.consommation_urbaine, v.consommation_extra_urbaine, v.consomation_mixte,
                v.emission_CO2, v.Norme_euro, v.Crit_air, v.nombre_rapport,
                v.largeur_sans_retros, v.hauteur, v.empattement, v.poids_vide,
                v.suspension_avant, v.suspension_arriere, v.freins_avant, v.freins_arriere,
                v.diametre_braquage, v.id_generation
            FROM version v
            WHERE v.id_generation = ?
            ORDER BY v.nom
        ');
        $stmt->execute([$idGeneration]);
        return $stmt->fetchAll();
    }

    public function findVersionById(int $id): ?array
    {
        $stmt = $this->db->getConnection()->prepare('
            SELECT v.*, g.nom AS generation_nom, g.id_modele,
                mo.nom AS modele_nom, mo.id_marque, ma.nom AS marque_nom
            FROM version v
            JOIN generation g ON v.id_generation = g.id_generation
            JOIN modele mo ON g.id_modele = mo.id_modele
            JOIN marque ma ON mo.id_marque = ma.id_marque
            WHERE v.id_version = ?
        ');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function createVersion(
        int $idGeneration,
        string $nom,
        ?string $transmission,
        ?string $boiteVitesse,
        ?int $nbPlaces,
        ?int $nbPortes,
        ?int $vitesseMax,
        ?float $consoUrbaine,
        ?float $consoExtraUrbaine,
        ?float $consoMixte,
        ?int $emissionCO2,
        ?string $normeEuro,
        ?int $critAir,
        ?int $nbRapports,
        ?int $largeur,
        ?int $hauteur,
        ?int $empattement,
        ?int $poids,
        ?string $suspAvant,
        ?string $suspArriere,
        ?string $freinsAvant,
        ?string $freinsArriere,
        ?float $diametreBraquage
    ): int {
        $pdo  = $this->db->getConnection();
        $stmt = $pdo->prepare('
            INSERT INTO version (
                id_generation, nom, transmission, boite_vitesse, nombre_places, nombre_portes,
                vitesse_max, consommation_urbaine, consommation_extra_urbaine, consomation_mixte,
                emission_CO2, Norme_euro, Crit_air, nombre_rapport,
                largeur_sans_retros, hauteur, empattement, poids_vide,
                suspension_avant, suspension_arriere, freins_avant, freins_arriere, diametre_braquage
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $idGeneration, trim($nom), $transmission ?: null, $boiteVitesse ?: null,
            $nbPlaces ?: null, $nbPortes ?: null,
            $vitesseMax ?: null, $consoUrbaine ?: null, $consoExtraUrbaine ?: null, $consoMixte ?: null,
            $emissionCO2 ?: null, $normeEuro ?: null, $critAir ?: null, $nbRapports ?: null,
            $largeur ?: null, $hauteur ?: null, $empattement ?: null, $poids ?: null,
            $suspAvant ?: null, $suspArriere ?: null, $freinsAvant ?: null, $freinsArriere ?: null,
            $diametreBraquage ?: null,
        ]);
        return (int) $pdo->lastInsertId();
    }

    public function deleteVersion(int $id): bool
    {
        $count = $this->db->getConnection()->prepare('SELECT COUNT(*) FROM annonce WHERE id_version = ?');
        $count->execute([$id]);
        if ((int) $count->fetchColumn() > 0) {
            return false;
        }
        $this->db->getConnection()->prepare('DELETE FROM version WHERE id_version = ?')->execute([$id]);
        return true;
    }
}
