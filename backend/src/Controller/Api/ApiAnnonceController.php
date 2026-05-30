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
}