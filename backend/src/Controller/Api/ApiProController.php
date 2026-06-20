<?php

namespace App\Controller\Api;

use App\Repository\AvisRepository;
use App\Repository\MessagerieRepository;
use App\Repository\StatsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/pro')]
class ApiProController extends AbstractController
{
    private function guard(): ?JsonResponse
    {
        if (!$this->getUser()) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }
        if (!$this->isGranted('ROLE_ENTREPRISE') && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Accès réservé aux professionnels'], 403);
        }
        return null;
    }

    #[Route('/stats', methods: ['GET'])]
    public function stats(
        StatsRepository $stats,
        AvisRepository $avis,
        MessagerieRepository $messagerie
    ): JsonResponse {
        if ($e = $this->guard()) return $e;

        $user = $this->getUser();
        $uid  = $user->getId();

        $kpis         = $stats->getStatsEntreprise($uid);
        $avisStats    = $avis->getStats($uid);
        $nonLus       = $messagerie->countUnreadMessages($uid);
        $ventesParMois = $stats->getVentesParMoisEntreprise($uid);
        $parMarque    = $stats->getAnnoncesParMarquePro($uid);
        $parStatut    = $stats->getRepartitionStatutPro($uid);
        $derniersAvis = $stats->getDerniersAvisPro($uid);
        $topAnnonces  = $stats->getTopAnnoncesPro($uid);

        return $this->json([
            'total_annonces'    => $kpis['total']           ?? 0,
            'annonces_actives'  => $kpis['actives']         ?? 0,
            'annonces_vendues'  => $kpis['vendues']         ?? 0,
            'annonces_en_pause' => $kpis['en_pause']        ?? 0,
            'chiffre_affaires'  => $kpis['ca_total']        ?? 0,
            'prix_moyen_vente'  => $kpis['prix_moyen_vente'] ?? 0,
            'taux_conversion'   => $kpis['taux_conversion'] ?? 0,
            'note_moyenne'      => $avisStats['note_moyenne'] ?? null,
            'nombre_avis'       => $avisStats['nb_avis']    ?? 0,
            'messages_non_lus'  => $nonLus,
            'ventes_par_mois'   => $ventesParMois,
            'annonces_par_marque' => $parMarque,
            'repartition_statut'  => $parStatut,
            'derniers_avis'     => $derniersAvis,
            'top_annonces'      => $topAnnonces,
        ]);
    }

    #[Route('/annonces', methods: ['GET'])]
    public function annonces(StatsRepository $stats): JsonResponse
    {
        if ($e = $this->guard()) return $e;
        return $this->json($stats->getAnnoncesPro($this->getUser()->getId()));
    }
}
