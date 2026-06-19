<?php

namespace App\Controller\Api;

use App\Repository\CatalogueAdminRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin/catalogue')]
class ApiCatalogueAdminController extends AbstractController
{
    private function guard(): ?JsonResponse
    {
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Accès refusé'], 403);
        }
        return null;
    }

    // ── Marques ───────────────────────────────────────────────────────────────

    #[Route('/marques', methods: ['GET'])]
    public function marques(CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        return $this->json($repo->findAllMarques());
    }

    #[Route('/marques', methods: ['POST'])]
    public function createMarque(Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['nom'])) return $this->json(['message' => 'Nom requis'], 400);
        $d['nom'] = trim($d['nom']);
        $id = $repo->createMarque($d);
        return $this->json(['message' => 'Marque créée', 'id' => $id], 201);
    }

    #[Route('/marques/{id}', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function updateMarque(int $id, Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['nom'])) return $this->json(['message' => 'Nom requis'], 400);
        $d['nom'] = trim($d['nom']);
        $repo->updateMarque($id, $d);
        return $this->json(['message' => 'Marque mise à jour']);
    }

    #[Route('/marques/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteMarque(int $id, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $repo->deleteMarque($id);
        return $this->json(['message' => 'Marque supprimée']);
    }

    // ── Types ─────────────────────────────────────────────────────────────────

    #[Route('/types', methods: ['GET'])]
    public function types(CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        return $this->json($repo->findAllTypes());
    }

    #[Route('/types', methods: ['POST'])]
    public function createType(Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['nom'])) return $this->json(['message' => 'Nom requis'], 400);
        $id = $repo->createType(trim($d['nom']));
        return $this->json(['message' => 'Type créé', 'id' => $id], 201);
    }

    #[Route('/types/{id}', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function updateType(int $id, Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['nom'])) return $this->json(['message' => 'Nom requis'], 400);
        $repo->updateType($id, trim($d['nom']));
        return $this->json(['message' => 'Type mis à jour']);
    }

    #[Route('/types/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteType(int $id, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $repo->deleteType($id);
        return $this->json(['message' => 'Type supprimé']);
    }

    // ── Modèles ───────────────────────────────────────────────────────────────

    #[Route('/modeles', methods: ['GET'])]
    public function modeles(CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        return $this->json($repo->findAllModeles());
    }

    #[Route('/modeles', methods: ['POST'])]
    public function createModele(Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['nom']) || empty($d['id_marque'])) {
            return $this->json(['message' => 'Nom et marque requis'], 400);
        }
        $id = $repo->createModele(
            trim($d['nom']), (int)$d['id_marque'],
            isset($d['id_type']) ? (int)$d['id_type'] : null,
            isset($d['annee_creation']) && $d['annee_creation'] ? (int)$d['annee_creation'] : null
        );
        return $this->json(['message' => 'Modèle créé', 'id' => $id], 201);
    }

    #[Route('/modeles/{id}', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function updateModele(int $id, Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['nom']) || empty($d['id_marque'])) {
            return $this->json(['message' => 'Nom et marque requis'], 400);
        }
        $repo->updateModele(
            $id, trim($d['nom']), (int)$d['id_marque'],
            isset($d['id_type']) ? (int)$d['id_type'] : null,
            isset($d['annee_creation']) && $d['annee_creation'] ? (int)$d['annee_creation'] : null
        );
        return $this->json(['message' => 'Modèle mis à jour']);
    }

    #[Route('/modeles/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteModele(int $id, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $repo->deleteModele($id);
        return $this->json(['message' => 'Modèle supprimé']);
    }

    // ── Réservoirs ────────────────────────────────────────────────────────────

    #[Route('/reservoirs', methods: ['GET'])]
    public function reservoirs(CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        return $this->json($repo->findAllReservoirs());
    }

    #[Route('/reservoirs', methods: ['POST'])]
    public function createReservoir(Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['volume']) && empty($d['type'])) return $this->json(['message' => 'Volume ou type requis'], 400);
        $id = $repo->createReservoir($d);
        return $this->json(['message' => 'Réservoir créé', 'id' => $id], 201);
    }

    #[Route('/reservoirs/{id}', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function updateReservoir(int $id, Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $repo->updateReservoir($id, json_decode($request->getContent(), true));
        return $this->json(['message' => 'Réservoir mis à jour']);
    }

    #[Route('/reservoirs/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteReservoir(int $id, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $repo->deleteReservoir($id);
        return $this->json(['message' => 'Réservoir supprimé']);
    }

    // ── Moteurs ───────────────────────────────────────────────────────────────

    #[Route('/moteurs', methods: ['GET'])]
    public function moteurs(CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        return $this->json($repo->findAllMoteurs());
    }

    #[Route('/moteurs', methods: ['POST'])]
    public function createMoteur(Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['nom'])) return $this->json(['message' => 'Nom requis'], 400);
        $id = $repo->createMoteur($d);
        return $this->json(['message' => 'Moteur créé', 'id' => $id], 201);
    }

    #[Route('/moteurs/{id}', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function updateMoteur(int $id, Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['nom'])) return $this->json(['message' => 'Nom requis'], 400);
        $repo->updateMoteur($id, $d);
        return $this->json(['message' => 'Moteur mis à jour']);
    }

    #[Route('/moteurs/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteMoteur(int $id, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $repo->deleteMoteur($id);
        return $this->json(['message' => 'Moteur supprimé']);
    }

    // ── Coffres ───────────────────────────────────────────────────────────────

    #[Route('/coffres', methods: ['GET'])]
    public function coffres(CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        return $this->json($repo->findAllCoffres());
    }

    #[Route('/coffres', methods: ['POST'])]
    public function createCoffre(Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['volume'])) return $this->json(['message' => 'Volume requis'], 400);
        $id = $repo->createCoffre((int)$d['volume']);
        return $this->json(['message' => 'Coffre créé', 'id' => $id], 201);
    }

    #[Route('/coffres/{id}', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function updateCoffre(int $id, Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        $repo->updateCoffre($id, (int)$d['volume']);
        return $this->json(['message' => 'Coffre mis à jour']);
    }

    #[Route('/coffres/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteCoffre(int $id, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $repo->deleteCoffre($id);
        return $this->json(['message' => 'Coffre supprimé']);
    }

    // ── Versions ──────────────────────────────────────────────────────────────

    #[Route('/versions', methods: ['GET'])]
    public function versions(CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        return $this->json($repo->findAllVersions());
    }

    #[Route('/versions', methods: ['POST'])]
    public function createVersion(Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['nom']) || empty($d['id_generation'])) {
            return $this->json(['message' => 'Nom et génération requis'], 400);
        }
        $id = $repo->createVersion($d);
        return $this->json(['message' => 'Version créée', 'id' => $id], 201);
    }

    #[Route('/versions/{id}', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function updateVersion(int $id, Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['nom']) || empty($d['id_generation'])) {
            return $this->json(['message' => 'Nom et génération requis'], 400);
        }
        $repo->updateVersion($id, $d);
        return $this->json(['message' => 'Version mise à jour']);
    }

    #[Route('/versions/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteVersion(int $id, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $repo->deleteVersion($id);
        return $this->json(['message' => 'Version supprimée']);
    }

    // ── Possession moteur ─────────────────────────────────────────────────────

    #[Route('/versions/{vId}/moteurs', methods: ['GET'], requirements: ['vId' => '\d+'])]
    public function versionMoteurs(int $vId, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        return $this->json($repo->getMoteursByVersion($vId));
    }

    #[Route('/versions/{vId}/moteurs/{mId}', methods: ['POST'], requirements: ['vId' => '\d+', 'mId' => '\d+'])]
    public function addMoteur(int $vId, int $mId, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $repo->addMoteurToVersion($vId, $mId);
        return $this->json(['message' => 'Moteur associé'], 201);
    }

    #[Route('/versions/{vId}/moteurs/{mId}', methods: ['DELETE'], requirements: ['vId' => '\d+', 'mId' => '\d+'])]
    public function removeMoteur(int $vId, int $mId, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $repo->removeMoteurFromVersion($vId, $mId);
        return $this->json(['message' => 'Moteur dissocié']);
    }

    // ── Générations ───────────────────────────────────────────────────────────

    #[Route('/generations', methods: ['GET'])]
    public function generations(CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        return $this->json($repo->findAllGenerations());
    }

    #[Route('/generations', methods: ['POST'])]
    public function createGeneration(Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['nom']) || empty($d['id_modele'])) {
            return $this->json(['message' => 'Nom et modèle requis'], 400);
        }
        $id = $repo->createGeneration(trim($d['nom']), (int)$d['id_modele'], $this->parseAnnee($d['date_sortie'] ?? null));
        return $this->json(['message' => 'Génération créée', 'id' => $id], 201);
    }

    #[Route('/generations/{id}', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function updateGeneration(int $id, Request $request, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $d = json_decode($request->getContent(), true);
        if (empty($d['nom']) || empty($d['id_modele'])) {
            return $this->json(['message' => 'Nom et modèle requis'], 400);
        }
        $repo->updateGeneration($id, trim($d['nom']), (int)$d['id_modele'], $this->parseAnnee($d['date_sortie'] ?? null));
        return $this->json(['message' => 'Génération mise à jour']);
    }

    private function parseAnnee(?string $val): ?string
    {
        if (!$val) return null;
        $v = trim($val);
        return preg_match('/^\d{4}$/', $v) ? $v . '-01-01' : $v;
    }

    #[Route('/generations/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteGeneration(int $id, CatalogueAdminRepository $repo): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        $repo->deleteGeneration($id);
        return $this->json(['message' => 'Génération supprimée']);
    }
}
