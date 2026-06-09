<?php

namespace App\Controller\Api;

use App\Repository\AvisRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/avis')]
class ApiAvisController extends AbstractController
{
    #[Route('/modele/{id}', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function avisModele(int $id, AvisRepository $repo): JsonResponse
    {
        return $this->json([
            'avis' => $repo->findByModele($id),
            'stats' => $repo->getStatsModele($id),
        ]);
    }

    #[Route('/vendeur/{id}', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function avisVendeur(int $id, AvisRepository $repo): JsonResponse
    {
        return $this->json($repo->findByVendeur($id));
    }
}