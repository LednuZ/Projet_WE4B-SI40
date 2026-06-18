<?php

namespace App\Controller\Api;

use App\Service\DatabaseService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/profil')]
class ApiProfilController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function getProfil(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        return $this->json([
            'id_utilisateur'   => $user->getId(),
            'nom'              => $user->getNom(),
            'prenom'           => $user->getPrenom(),
            'email'            => $user->getEmail(),
            'role'             => $user->getRole(),
            'numero_phone'     => $user->getNumeroPhone(),
            'date_inscription' => $user->getDateInscription()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('', methods: ['PUT'])]
    public function updateProfil(Request $request, DatabaseService $db): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['nom']) || empty($data['prenom']) || empty($data['email'])) {
            return $this->json(['message' => 'Nom, prénom et email sont obligatoires'], 400);
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->json(['message' => 'Format d\'email invalide'], 400);
        }

        $pdo = $db->getConnection();

        if ($data['email'] !== $user->getEmail()) {
            $stmt = $pdo->prepare('SELECT id_utilisateur FROM utilisateur WHERE email = ? AND id_utilisateur != ?');
            $stmt->execute([$data['email'], $user->getId()]);
            if ($stmt->fetch()) {
                return $this->json(['message' => 'Cet email est déjà utilisé'], 409);
            }
        }

        $stmt = $pdo->prepare(
            'UPDATE utilisateur SET nom = ?, prenom = ?, email = ?, numero_phone = ? WHERE id_utilisateur = ?'
        );
        $stmt->execute([
            $data['nom'],
            $data['prenom'],
            $data['email'],
            $data['numero_phone'] ?? null,
            $user->getId(),
        ]);

        return $this->json(['message' => 'Profil mis à jour avec succès']);
    }

    #[Route('/password', methods: ['PUT'])]
    public function updatePassword(
        Request $request,
        DatabaseService $db,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['ancien_mdp']) || empty($data['nouveau_mdp'])) {
            return $this->json(['message' => 'Ancien et nouveau mot de passe requis'], 400);
        }

        if (strlen($data['nouveau_mdp']) < 8) {
            return $this->json(['message' => 'Le nouveau mot de passe doit contenir au moins 8 caractères'], 400);
        }

        if (!$hasher->isPasswordValid($user, $data['ancien_mdp'])) {
            return $this->json(['message' => 'Ancien mot de passe incorrect'], 400);
        }

        $newHash = $hasher->hashPassword($user, $data['nouveau_mdp']);

        $pdo = $db->getConnection();
        $stmt = $pdo->prepare('UPDATE utilisateur SET mdp = ? WHERE id_utilisateur = ?');
        $stmt->execute([$newHash, $user->getId()]);

        return $this->json(['message' => 'Mot de passe mis à jour avec succès']);
    }

    #[Route('', methods: ['DELETE'])]
    public function deleteCompte(
        Request $request,
        DatabaseService $db,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['mdp'])) {
            return $this->json(['message' => 'Mot de passe requis pour confirmer la suppression'], 400);
        }

        if (!$hasher->isPasswordValid($user, $data['mdp'])) {
            return $this->json(['message' => 'Mot de passe incorrect'], 400);
        }

        $pdo = $db->getConnection();
        $id  = $user->getId();

        $pdo->prepare('DELETE FROM message   WHERE id_expediteur = ? OR id_destinataire = ?')->execute([$id, $id]);
        $pdo->prepare('DELETE FROM favori    WHERE id_utilisateur = ?')->execute([$id]);
        $pdo->prepare('DELETE FROM avis_utilisateur WHERE id_auteur = ? OR id_vendeur = ?')->execute([$id, $id]);

        // Supprimer les photos puis les annonces du vendeur
        $stmt = $pdo->prepare('SELECT id_annonce FROM annonce WHERE id_utilisateur = ?');
        $stmt->execute([$id]);
        $annonceIds = $stmt->fetchAll(\PDO::FETCH_COLUMN);
        if ($annonceIds) {
            $in = implode(',', array_fill(0, count($annonceIds), '?'));
            $pdo->prepare("DELETE FROM photo WHERE id_annonce IN ($in)")->execute($annonceIds);
            $pdo->prepare("DELETE FROM annonce WHERE id_annonce IN ($in)")->execute($annonceIds);
        }

        $pdo->prepare('DELETE FROM utilisateur WHERE id_utilisateur = ?')->execute([$id]);

        return $this->json(['message' => 'Compte supprimé avec succès']);
    }
}
