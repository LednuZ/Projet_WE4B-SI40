<?php

namespace App\Controller\Api;

use App\Repository\AdminRepository;
use App\Repository\AvisRepository;
use App\Repository\StatsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin')]
class ApiAdminController extends AbstractController
{
    private function checkAdmin(): ?JsonResponse
    {
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Accès refusé'], 403);
        }
        return null;
    }

    // Statistiques

    #[Route('/stats', methods: ['GET'])]
    public function stats(StatsRepository $repo): JsonResponse
    {
        if ($err = $this->checkAdmin()) return $err;

        return $this->json([
            ...$repo->getAdminKpis(),
            'annonces_par_marque'    => $repo->getAnnoncesParMarque(),
            'annonces_par_mois'      => $repo->getAnnoncesParMois(),
            'inscriptions_par_mois'  => $repo->getInscriptionsParMois(),
            'prix_moyen_par_marque'  => $repo->getPrixMoyenParMarqueAdmin(),
            'repartition_carburant'  => $repo->getRepartitionCarburant(),
            'repartition_boite'      => $repo->getRepartitionBoite(),
            'annonces_par_statut'    => $repo->getAnnoncesParStatut(),
            'top_vendeurs'           => $repo->getTopVendeurs(),
            ...$repo->getPrixMoyenGlobal(),
        ]);
    }

    // Utilisateurs

    #[Route('/utilisateurs', methods: ['GET'])]
    public function utilisateurs(AdminRepository $repo): JsonResponse
    {
        if ($err = $this->checkAdmin()) return $err;
        return $this->json($repo->findAllUsers());
    }

    #[Route('/utilisateurs/{id}/role', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function updateRole(int $id, Request $request, AdminRepository $repo): JsonResponse
    {
        if ($err = $this->checkAdmin()) return $err;

        $data  = json_decode($request->getContent(), true);
        $roles = ['particulier', 'entreprise', 'admin'];

        if (empty($data['role']) || !in_array($data['role'], $roles)) {
            return $this->json(['message' => 'Rôle invalide'], 400);
        }

        $repo->updateRole($id, $data['role']);
        return $this->json(['message' => 'Rôle mis à jour']);
    }

    #[Route('/utilisateurs/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteUser(int $id, AdminRepository $repo): JsonResponse
    {
        if ($err = $this->checkAdmin()) return $err;

        if ($id === $this->getUser()?->getId()) {
            return $this->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte'], 400);
        }

        $repo->deleteUser($id);
        return $this->json(['message' => 'Utilisateur supprimé']);
    }

    // Annonces

    #[Route('/annonces', methods: ['GET'])]
    public function annonces(AdminRepository $repo): JsonResponse
    {
        if ($err = $this->checkAdmin()) return $err;
        return $this->json($repo->findAllAnnonces());
    }

    #[Route('/annonces/{id}/statut', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function updateStatut(int $id, Request $request, AdminRepository $repo): JsonResponse
    {
        if ($err = $this->checkAdmin()) return $err;

        $data    = json_decode($request->getContent(), true);
        $statuts = ['active', 'pause', 'suspendu', 'vendu'];

        if (empty($data['statut']) || !in_array($data['statut'], $statuts)) {
            return $this->json(['message' => 'Statut invalide'], 400);
        }

        $repo->updateStatutAnnonce($id, $data['statut'], $data['commentaire_admin'] ?? null);
        return $this->json(['message' => 'Statut mis à jour']);
    }

    #[Route('/annonces/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteAnnonce(int $id, AdminRepository $repo): JsonResponse
    {
        if ($err = $this->checkAdmin()) return $err;
        $repo->deleteAnnonce($id);
        return $this->json(['message' => 'Annonce supprimée']);
    }

    // ── Avis ─────────────────────────────────────────────────────────────────

    #[Route('/avis', methods: ['GET'])]
    public function avis(AvisRepository $repo): JsonResponse
    {
        if ($err = $this->checkAdmin()) return $err;
        return $this->json([
            'vendeurs' => $repo->findAllVendeurAvis(),
            'modeles'  => $repo->findAllModeleAvis(),
        ]);
    }

    #[Route('/avis/vendeur/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteAvisVendeur(int $id, AvisRepository $repo): JsonResponse
    {
        if ($err = $this->checkAdmin()) return $err;
        $repo->delete($id);
        return $this->json(['message' => 'Avis supprimé']);
    }

    #[Route('/avis/modele/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteAvisModele(int $id, AvisRepository $repo): JsonResponse
    {
        if ($err = $this->checkAdmin()) return $err;
        $repo->deleteModele($id);
        return $this->json(['message' => 'Avis supprimé']);
    }
}
