<?php

namespace App\Controller\Api;

use App\Repository\AvisRepository;
use App\Repository\AnnonceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/vendeur')]
class ApiVendeurController extends AbstractController
{
    #[Route('/{id}', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function profil(int $id, AvisRepository $avisRepo, AnnonceRepository $annonceRepo): JsonResponse
    {
        $utilisateur = $avisRepo->findVendeurPublic($id);
        if (!$utilisateur) {
            return $this->json(['message' => 'Utilisateur introuvable'], 404);
        }

        $stats   = $avisRepo->getStats($id);
        $avis    = $avisRepo->findByVendeur($id);
        $annonces = $annonceRepo->findAll(['vendeur_id' => $id], 'recent');

        return $this->json([
            'utilisateur' => $utilisateur,
            'stats'       => $stats,
            'avis'        => $avis,
            'annonces'    => $annonces,
        ]);
    }
}
