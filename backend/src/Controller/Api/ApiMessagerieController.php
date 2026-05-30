<?php

namespace App\Controller\Api;

use App\Repository\MessagerieRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/messages')]
class ApiMessagerieController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function liste(MessagerieRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        return $this->json($repo->findByUser($user->getId()));
    }
}