<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Service\DatabaseService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/auth')]
class ApiAuthController extends AbstractController
{
    #[Route('/login', methods: ['POST'])]
    public function login(Request $request, DatabaseService $db, UserPasswordHasherInterface $hasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $email = trim($data['email'] ?? '');
        $mdp = trim($data['mdp'] ?? '');

        if (empty($email) || empty($mdp)) {
            return $this->json(['message' => 'Email et mot de passe requis'], 400);
        }

        $pdo  = $db->getConnection();
        $stmt = $pdo->prepare('SELECT * FROM utilisateur WHERE email = ?');
        $stmt->execute([$email]);
        $row = $stmt->fetch();

        if (!$row) {
            return $this->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        $user = new User();
        $user->setMdp($row['mdp']);

        if (!$hasher->isPasswordValid($user, $mdp)) {
            return $this->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        $token = base64_encode($row['id_utilisateur'] . ':' . $row['email']);
        unset($row['mdp']);

        return $this->json([
            'message'     => 'Connexion réussie',
            'token'       => $token,
            'utilisateur' => $row,          // contient désormais username
        ]);
    }

    #[Route('/register', methods: ['POST'])]
    public function register(Request $request, DatabaseService $db, UserPasswordHasherInterface $hasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['nom']) || empty($data['prenom']) || empty($data['email'])
            || empty($data['mdp']) || empty($data['username'])) {
            return $this->json(['message' => 'Tous les champs obligatoires doivent être remplis'], 400);
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->json(['message' => 'Format d\'email invalide'], 400);
        }

        if (strlen($data['mdp']) < 8) {
            return $this->json(['message' => 'Le mot de passe doit contenir au moins 8 caractères'], 400);
        }

        $username = trim($data['username']);
        if (strlen($username) < 3 || strlen($username) > 50) {
            return $this->json(['message' => 'Le nom d\'utilisateur doit contenir entre 3 et 50 caractères'], 400);
        }

        $rolesAutorises = ['particulier', 'entreprise'];
        $role = $data['role'] ?? 'particulier';
        if (!in_array($role, $rolesAutorises)) {
            $role = 'particulier';
        }

        $pdo = $db->getConnection();

        $stmt = $pdo->prepare('SELECT id_utilisateur FROM utilisateur WHERE email = ?');
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            return $this->json(['message' => 'Cet email est déjà utilisé'], 409);
        }

        $stmt = $pdo->prepare('SELECT id_utilisateur FROM utilisateur WHERE username = ?');
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            return $this->json(['message' => 'Ce nom d\'utilisateur est déjà pris'], 409);
        }

        $tempUser = new User();
        $tempUser->setMdp('');
        $mdpHash = $hasher->hashPassword($tempUser, $data['mdp']);

        $pdo->prepare(
            'INSERT INTO utilisateur (nom, prenom, username, email, mdp, role, numero_phone) VALUES (?,?,?,?,?,?,?)'
        )->execute([
            $data['nom'], $data['prenom'], $username,
            $data['email'], $mdpHash, $role,
            $data['numero_phone'] ?? null,
        ]);

        return $this->json([
            'message'        => 'Inscription réussie',
            'id_utilisateur' => (int) $pdo->lastInsertId(),
        ], 201);
    }

    #[Route('/check-username', methods: ['POST'])]
    public function checkUsername(Request $request, DatabaseService $db): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $username = trim($data['username'] ?? '');
        if (empty($username)) return $this->json(['available' => false]);

        $stmt = $db->getConnection()->prepare('SELECT 1 FROM utilisateur WHERE username = ?');
        $stmt->execute([$username]);
        return $this->json(['available' => !$stmt->fetch()]);
    }
}
