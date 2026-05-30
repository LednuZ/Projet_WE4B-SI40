<?php

namespace App\Controller\Api;

use App\Repository\StatsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/stats')]
class ApiStatsController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(StatsRepository $repo): JsonResponse
    {
        return $this->json($repo->getDashboardStats());
    }
}