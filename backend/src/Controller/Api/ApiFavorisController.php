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

        return $this->json($repo->findByUser($user->getId()));
    }

    #[Route('/check/{id}', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function check(int $id, FavorisRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['isFavori' => false]);
        }

        return $this->json(['isFavori' => $repo->isFavori($user->getId(), $id)]);
    }

    #[Route('/{id}', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function add(int $id, FavorisRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $repo->add($user->getId(), $id);
        return $this->json(['message' => 'Ajouté aux favoris'], 201);
    }

    #[Route('/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function remove(int $id, FavorisRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $repo->remove($user->getId(), $id);
        return $this->json(['message' => 'Retiré des favoris']);
    }
}
