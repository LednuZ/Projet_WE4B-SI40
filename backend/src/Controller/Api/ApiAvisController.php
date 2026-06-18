<?php

namespace App\Controller\Api;

use App\Repository\AvisRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/avis')]
class ApiAvisController extends AbstractController
{
    // ── Mes avis ─────────────────────────────────────────────────────────────

    #[Route('/mes-avis', methods: ['GET'])]
    public function mesAvis(AvisRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        return $this->json([
            'vendeurs' => $repo->findByRedacteurVendeur($user->getId()),
            'modeles'  => $repo->findByRedacteurModele($user->getId()),
        ]);
    }

    // ── Avis vendeur ─────────────────────────────────────────────────────────

    #[Route('/vendeur/{id}', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function avisVendeur(int $id, AvisRepository $repo): JsonResponse
    {
        return $this->json([
            'avis'  => $repo->findByVendeur($id),
            'stats' => $repo->getStats($id),
        ]);
    }

    #[Route('/vendeur', methods: ['POST'])]
    public function createAvisVendeur(Request $request, AvisRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['id_vendeur']) || empty($data['note'])) {
            return $this->json(['message' => 'id_vendeur et note sont requis'], 400);
        }

        $note = (int) $data['note'];
        if ($note < 1 || $note > 5) {
            return $this->json(['message' => 'La note doit être comprise entre 1 et 5'], 400);
        }

        if ((int) $data['id_vendeur'] === $user->getId()) {
            return $this->json(['message' => 'Vous ne pouvez pas vous auto-noter'], 400);
        }

        if ($repo->hasAlreadyReviewed($user->getId(), (int) $data['id_vendeur'])) {
            return $this->json(['message' => 'Vous avez déjà noté ce vendeur'], 409);
        }

        $id = $repo->create(
            $user->getId(),
            (int) $data['id_vendeur'],
            $note,
            !empty($data['contenu']) ? trim($data['contenu']) : null
        );

        return $this->json(['message' => 'Avis ajouté', 'id' => $id], 201);
    }

    #[Route('/vendeur/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteAvisVendeur(int $id, AvisRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $avis = $repo->findById($id);
        if (!$avis) {
            return $this->json(['message' => 'Avis introuvable'], 404);
        }

        if ((int) $avis['id_redacteur'] !== $user->getId() && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Non autorisé'], 403);
        }

        $repo->delete($id);
        return $this->json(['message' => 'Avis supprimé']);
    }

    // ── Avis modèle ──────────────────────────────────────────────────────────

    #[Route('/modele/{id}', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function avisModele(int $id, AvisRepository $repo): JsonResponse
    {
        return $this->json([
            'avis'  => $repo->findByModele($id),
            'stats' => $repo->getStatsModele($id),
        ]);
    }

    #[Route('/modele', methods: ['POST'])]
    public function createAvisModele(Request $request, AvisRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['id_modele']) || empty($data['note'])) {
            return $this->json(['message' => 'id_modele et note sont requis'], 400);
        }

        $note = (int) $data['note'];
        if ($note < 1 || $note > 5) {
            return $this->json(['message' => 'La note doit être comprise entre 1 et 5'], 400);
        }

        if ($repo->hasAlreadyReviewedModele($user->getId(), (int) $data['id_modele'])) {
            return $this->json(['message' => 'Vous avez déjà noté ce modèle'], 409);
        }

        $repo->createModele(
            $user->getId(),
            (int) $data['id_modele'],
            $note,
            !empty($data['contenu']) ? trim($data['contenu']) : null
        );

        return $this->json(['message' => 'Avis ajouté'], 201);
    }

    #[Route('/modele/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function deleteAvisModele(int $id, AvisRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $avis = $repo->findModeleAvisById($id);
        if (!$avis) {
            return $this->json(['message' => 'Avis introuvable'], 404);
        }

        if ((int) $avis['id_redacteur'] !== $user->getId() && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Non autorisé'], 403);
        }

        $repo->deleteModele($id);
        return $this->json(['message' => 'Avis supprimé']);
    }
}
