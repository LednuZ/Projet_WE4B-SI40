<?php

namespace App\Security;

use App\Entity\User;
use App\Service\DatabaseService;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class UserProvider implements UserProviderInterface
{
    public function __construct(private DatabaseService $db) {}

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        $stmt = $this->db->getConnection()->prepare(
            'SELECT * FROM utilisateur WHERE email = ?'
        );
        $stmt->execute([$identifier]);
        $row = $stmt->fetch();

        if (!$row) {
            $e = new UserNotFoundException();
            $e->setUserIdentifier($identifier);
            throw $e;
        }

        return $this->hydrate($row);
    }

    public function refreshUser(UserInterface $user): UserInterface
    {
        return $this->loadUserByIdentifier($user->getUserIdentifier());
    }

    public function supportsClass(string $class): bool
    {
        return User::class === $class || is_subclass_of($class, User::class);
    }

    private function hydrate(array $row): User
    {
        $user = new User();
        $user->setId((int) $row['id_utilisateur']);
        $user->setNom($row['nom']);
        $user->setPrenom($row['prenom']);
        $user->setEmail($row['email']);
        $user->setMdp($row['mdp']);
        $user->setRole($row['role']);
        $user->setNumeroPhone($row['numero_phone']);
        $user->setDateInscription(new \DateTime($row['date_inscription']));
        return $user;
    }
}
