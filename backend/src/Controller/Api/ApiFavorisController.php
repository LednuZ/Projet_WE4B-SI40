<?php

namespace App\Controller\Api;

use App\Repository\FavorisRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/favoris')]
class ApiFavorisController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function liste(FavorisRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $ids = $repo->getUserFavorisIds($user->getId());
        return $this->json($ids);
    }
}