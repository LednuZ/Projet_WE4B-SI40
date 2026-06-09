<?php

namespace App\Repository;

use App\Service\DatabaseService;

class MarqueRepository
{
    public function __construct(private DatabaseService $db) {}

    public function findAll(): array
    {
        return $this->db->getConnection()
            ->query('SELECT id_marque, nom FROM marque ORDER BY nom')
            ->fetchAll();
    }

    /** Returns [{marque_id, modeles: [{id_modele, nom}]}] for filter dropdowns */
    public function findModelesByMarque(): array
    {
        $stmt = $this->db->getConnection()->query(
            'SELECT mo.id_modele, mo.nom, mo.id_marque FROM modele mo ORDER BY mo.nom'
        );
        $rows = $stmt->fetchAll();
        $map  = [];
        foreach ($rows as $r) {
            $map[$r['id_marque']][] = ['id' => $r['id_modele'], 'nom' => $r['nom']];
        }
        return $map;
    }

    /** Returns full catalog tree: marque → modele → generation → version (for form selects) */
    public function getCatalogTree(): array
    {
        $stmt = $this->db->getConnection()->query('
            SELECT
                ma.id_marque, ma.nom AS marque_nom,
                mo.id_modele, mo.nom AS modele_nom,
                g.id_generation, g.nom AS generation_nom, g.date_sortie,
                v.id_version, v.nom AS version_nom, v.transmission, v.boite_vitesse
            FROM version v
            JOIN generation g ON v.id_generation = g.id_generation
            JOIN modele mo ON g.id_modele = mo.id_modele
            JOIN marque ma ON mo.id_marque = ma.id_marque
            ORDER BY ma.nom, mo.nom, g.date_sortie, v.nom
        ');
        $rows = $stmt->fetchAll();

        $tree = [];
        foreach ($rows as $r) {
            $mid = $r['id_marque'];
            $oid = $r['id_modele'];
            $gid = $r['id_generation'];

            if (!isset($tree[$mid])) {
                $tree[$mid] = ['id' => $mid, 'nom' => $r['marque_nom'], 'modeles' => []];
            }
            if (!isset($tree[$mid]['modeles'][$oid])) {
                $tree[$mid]['modeles'][$oid] = ['id' => $oid, 'nom' => $r['modele_nom'], 'generations' => []];
            }
            if (!isset($tree[$mid]['modeles'][$oid]['generations'][$gid])) {
                $label = $r['generation_nom'] ?? ($r['date_sortie'] ? substr($r['date_sortie'], 0, 4) : '');
                $tree[$mid]['modeles'][$oid]['generations'][$gid] = ['id' => $gid, 'nom' => $label, 'versions' => []];
            }
            $tree[$mid]['modeles'][$oid]['generations'][$gid]['versions'][] = [
                'id'  => $r['id_version'],
                'nom' => $r['version_nom'],
                'tx'  => $r['transmission'] ?? '',
                'bv'  => $r['boite_vitesse'] ?? '',
            ];
        }

        // Re-index for JSON serialization
        return array_values(array_map(function ($m) {
            $m['modeles'] = array_values(array_map(function ($mo) {
                $mo['generations'] = array_values(array_map(function ($g) {
                    return $g;
                }, $mo['generations']));
                return $mo;
            }, $m['modeles']));
            return $m;
        }, $tree));
    }
}
