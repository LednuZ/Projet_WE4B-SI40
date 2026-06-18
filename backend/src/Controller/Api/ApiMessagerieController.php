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
    /** GET /api/messages — liste des conversations de l'utilisateur connecté */
    #[Route('', methods: ['GET'])]
    public function liste(MessagerieRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        return $this->json($repo->findConversations($user->getId()));
    }

    /** GET /api/messages/{annonceId}/{userId} — messages d'une conversation */
    #[Route('/{annonceId}/{userId}', methods: ['GET'], requirements: ['annonceId' => '\d+', 'userId' => '\d+'])]
    public function conversation(int $annonceId, int $userId, MessagerieRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $messages       = $repo->findMessages($user->getId(), $userId, $annonceId);
        $interlocuteur  = $repo->findUtilisateur($userId);

        return $this->json([
            'messages'      => $messages,
            'interlocuteur' => $interlocuteur,
        ]);
    }

    /** POST /api/messages — envoyer un message */
    #[Route('', methods: ['POST'])]
    public function envoyer(Request $request, MessagerieRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['contenu']) || !isset($data['id_annonce']) || !isset($data['id_destinataire'])) {
            return $this->json(['message' => 'Contenu, id_annonce et id_destinataire sont requis'], 400);
        }

        if ((int) $data['id_destinataire'] === $user->getId()) {
            return $this->json(['message' => 'Vous ne pouvez pas vous envoyer un message'], 400);
        }

        $repo->envoyer(
            $user->getId(),
            (int) $data['id_destinataire'],
            (int) $data['id_annonce'],
            trim($data['contenu'])
        );

        return $this->json(['message' => 'Message envoyé'], 201);
    }

    /** PUT /api/messages/{annonceId}/{userId}/lire — marquer les messages reçus comme lus */
    #[Route('/{annonceId}/{userId}/lire', methods: ['PUT'], requirements: ['annonceId' => '\d+', 'userId' => '\d+'])]
    public function marquerLus(int $annonceId, int $userId, MessagerieRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        // L'expéditeur à marquer comme lu = userId (l'interlocuteur qui nous a écrit)
        $repo->marquerLus($userId, $user->getId(), $annonceId);

        return $this->json(['message' => 'Messages marqués comme lus']);
    }
}
