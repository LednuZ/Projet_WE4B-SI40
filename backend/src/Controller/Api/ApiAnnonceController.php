<?php

namespace App\Controller\Api;

use App\Repository\AnnonceRepository;
use App\Repository\MarqueRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/annonces')]
class ApiAnnonceController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function liste(Request $request, AnnonceRepository $repo): JsonResponse
    {
        $filters = [
            'marque_id' => $request->query->get('marque_id'),
            'modele_id' => $request->query->get('modele_id'),
            'prix_min'  => $request->query->get('prix_min'),
            'prix_max'  => $request->query->get('prix_max'),
            'km_max'    => $request->query->get('km_max'),
            'annee_min' => $request->query->get('annee_min'),
            'annee_max' => $request->query->get('annee_max'),
        ];

        $sort = $request->query->get('sort', 'recent');
        $annonces = $repo->findAll($filters, $sort);

        return $this->json($annonces);
    }
    #[Route('/mes-annonces', methods: ['GET'])]
    public function mesAnnonces(AnnonceRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        return $this->json($repo->findByVendeur($user->getId()));
    }

    #[Route('/{id}/pause', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function pause(int $id, AnnonceRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $owner = $repo->getOwner($id);
        if ($owner !== $user->getId()) {
            return $this->json(['message' => 'Non autorisé'], 403);
        }

        $repo->updateStatut($id, 'pause', null);
        return $this->json(['message' => 'Annonce mise en pause']);
    }

    #[Route('/{id}/reprendre', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function reprendre(int $id, AnnonceRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $annonce = $repo->findById($id);
        if (!$annonce || (int)$annonce['vendeur_id'] !== $user->getId()) {
            return $this->json(['message' => 'Non autorisé'], 403);
        }

        if (!empty($annonce['commentaire_admin'])) {
            return $this->json(['message' => 'Annonce suspendue par l\'administration'], 403);
        }

        $repo->updateStatut($id, 'active', null);
        return $this->json(['message' => 'Annonce remise en ligne']);
    }

    #[Route('/{id}/vendu', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function vendu(int $id, AnnonceRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $owner = $repo->getOwner($id);
        if ($owner !== $user->getId()) {
            return $this->json(['message' => 'Non autorisé'], 403);
        }

        $repo->marquerVendu($id);
        return $this->json(['message' => 'Annonce marquée comme vendue']);
    }

    #[Route('/{id}', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function detail(int $id, AnnonceRepository $repo): JsonResponse
    {
        $annonce = $repo->findById($id);
        if (!$annonce) {
            return $this->json(['message' => 'Annonce introuvable'], 404);
        }

        $annonce['photos'] = $repo->findPhotos($id);

        return $this->json($annonce);
    }

    #[Route('/marques', methods: ['GET'])]
    public function marques(MarqueRepository $repo): JsonResponse
    {
        return $this->json($repo->findAll());
    }

    #[Route('/catalogue-tree', methods: ['GET'])]
    public function catalogTree(MarqueRepository $repo): JsonResponse
    {
        return $this->json($repo->getCatalogTree());
    }
    
    #[Route('', methods: ['POST'])]
    public function create(Request $request, AnnonceRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);

        // Validation
        if (empty($data['id_version'])) {
            return $this->json(['message' => 'Veuillez sélectionner une version'], 400);
        }
        if (empty($data['prix']) || $data['prix'] <= 0) {
            return $this->json(['message' => 'Le prix doit être supérieur à 0'], 400);
        }
        if (empty($data['annee_circulation'])) {
            return $this->json(['message' => 'L\'année de circulation est requise'], 400);
        }
        if (!isset($data['kilometrage']) || $data['kilometrage'] < 0) {
            return $this->json(['message' => 'Le kilométrage est invalide'], 400);
        }

        $data['id_utilisateur'] = $user->getId();

        $id = $repo->create($data);

        return $this->json([
            'message' => 'Annonce créée avec succès',
            'id_annonce' => $id,
        ], 201);
    }

    #[Route('/{id}', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function update(int $id, Request $request, AnnonceRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $owner = $repo->getOwner($id);
        if ($owner !== $user->getId() && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Non autorisé'], 403);
        }

        $data = json_decode($request->getContent(), true);
        $repo->update($id, $data);

        return $this->json(['message' => 'Annonce mise à jour']);
    }

    #[Route('/{id}/photos', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function uploadPhoto(int $id, Request $request, AnnonceRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $owner = $repo->getOwner($id);
        if ($owner !== $user->getId()) {
            return $this->json(['message' => 'Non autorisé'], 403);
        }

        $file = $request->files->get('photo');
        if (!$file) {
            return $this->json(['message' => 'Aucun fichier reçu (limite PHP: ' . ini_get('upload_max_filesize') . ')'], 400);
        }

        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        $mime = $file->getMimeType();
        if (!in_array($mime, $allowedMimes)) {
            return $this->json(['message' => 'Format non supporté: ' . $mime . ' (JPG, PNG, WEBP uniquement)'], 400);
        }

        if ($file->getSize() > 20 * 1024 * 1024) {
            return $this->json(['message' => 'La photo ne doit pas dépasser 20 Mo'], 400);
        }

        try {
            $projectDir = $this->getParameter('kernel.project_dir');
            $dir = rtrim($projectDir, '/\\') . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'photos' . DIRECTORY_SEPARATOR;

            if (!is_dir($dir) && !mkdir($dir, 0777, true) && !is_dir($dir)) {
                return $this->json(['message' => 'Impossible de créer le dossier uploads: ' . $dir], 500);
            }

            $ext = $file->guessExtension() ?? pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION) ?? 'jpg';
            $filename = uniqid('photo_') . '.' . $ext;
            $file->move($dir, $filename);

            $url = '/uploads/photos/' . $filename;
            $repo->addPhoto($id, $url);

            return $this->json(['url' => $url], 201);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Erreur serveur: ' . $e->getMessage()], 500);
        }
    }

    #[Route('/photos/{photoId}', methods: ['DELETE'], requirements: ['photoId' => '\d+'])]
    public function deletePhoto(int $photoId, AnnonceRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $photo = $repo->findPhoto($photoId);
        if (!$photo) {
            return $this->json(['message' => 'Photo introuvable'], 404);
        }

        $owner = $repo->getOwner($photo['id_annonce']);
        if ($owner !== $user->getId() && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Non autorisé'], 403);
        }

        $filepath = $this->getParameter('kernel.project_dir') . '/public' . $photo['url_photo'];
        if (file_exists($filepath)) {
            unlink($filepath);
        }

        $repo->deletePhoto($photoId);
        return $this->json(['message' => 'Photo supprimée']);
    }

    #[Route('/{id}', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(int $id, AnnonceRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $owner = $repo->getOwner($id);
        if ($owner !== $user->getId() && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Non autorisé'], 403);
        }

        $repo->delete($id);

        return $this->json(['message' => 'Annonce supprimée']);
    }
}