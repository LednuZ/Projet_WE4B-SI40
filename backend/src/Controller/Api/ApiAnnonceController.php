<?php

namespace App\Controller\Api;

use App\Repository\AnnonceRepository;
use App\Repository\MarqueRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/annonces')]
class ApiAnnonceController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function liste(Request $request, AnnonceRepository $repo): JsonResponse
    {
        $filters = [
            'marque_id' => $request->query->get('marque_id'),
            'modele_id' => $request->query->get('modele_id'),
            'prix_min'  => $request->query->get('prix_min'),
            'prix_max'  => $request->query->get('prix_max'),
            'km_max'    => $request->query->get('km_max'),
            'annee_min' => $request->query->get('annee_min'),
            'annee_max' => $request->query->get('annee_max'),
        ];

        $sort = $request->query->get('sort', 'recent');
        $annonces = $repo->findAll($filters, $sort);

        return $this->json($annonces);
    }

    #[Route('/{id}', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function detail(int $id, AnnonceRepository $repo): JsonResponse
    {
        $annonce = $repo->findById($id);
        if (!$annonce) {
            return $this->json(['message' => 'Annonce introuvable'], 404);
        }

        $annonce['photos'] = $repo->findPhotos($id);

        return $this->json($annonce);
    }

    #[Route('/marques', methods: ['GET'])]
    public function marques(MarqueRepository $repo): JsonResponse
    {
        return $this->json($repo->findAll());
    }

    #[Route('/catalogue-tree', methods: ['GET'])]
    public function catalogTree(MarqueRepository $repo): JsonResponse
    {
        return $this->json($repo->getCatalogTree());
    }
    
    #[Route('', methods: ['POST'])]
    public function create(Request $request, AnnonceRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);

        // Validation
        if (empty($data['id_version'])) {
            return $this->json(['message' => 'Veuillez sélectionner une version'], 400);
        }
        if (empty($data['prix']) || $data['prix'] <= 0) {
            return $this->json(['message' => 'Le prix doit être supérieur à 0'], 400);
        }
        if (empty($data['annee_circulation'])) {
            return $this->json(['message' => 'L\'année de circulation est requise'], 400);
        }
        if (!isset($data['kilometrage']) || $data['kilometrage'] < 0) {
            return $this->json(['message' => 'Le kilométrage est invalide'], 400);
        }

        $data['id_utilisateur'] = $user->getId();

        $id = $repo->create($data);

        return $this->json([
            'message' => 'Annonce créée avec succès',
            'id_annonce' => $id,
        ], 201);
    }

    #[Route('/{id}', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function update(int $id, Request $request, AnnonceRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $owner = $repo->getOwner($id);
        if ($owner !== $user->getId() && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Non autorisé'], 403);
        }

        $data = json_decode($request->getContent(), true);
        $repo->update($id, $data);

        return $this->json(['message' => 'Annonce mise à jour']);
    }

    #[Route('/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(int $id, AnnonceRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $owner = $repo->getOwner($id);
        if ($owner !== $user->getId() && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Non autorisé'], 403);
        }

        $repo->delete($id);

        return $this->json(['message' => 'Annonce supprimée']);
    }
}