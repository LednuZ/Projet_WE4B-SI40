<?php

namespace App\Entity;

use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    private int $id;
    private string $nom;
    private string $prenom;
    private string $email;
    private string $mdp;
    private string $role; // 'admin' | 'vendeur' | 'acheteur' | 'entreprise'
    private ?string $numeroPhone;
    private \DateTimeInterface $dateInscription;

    public function getId(): int { return $this->id; }
    public function setId(int $id): void { $this->id = $id; }

    public function getNom(): string { return $this->nom; }
    public function setNom(string $nom): void { $this->nom = $nom; }

    public function getPrenom(): string { return $this->prenom; }
    public function setPrenom(string $prenom): void { $this->prenom = $prenom; }

    public function getEmail(): string { return $this->email; }
    public function setEmail(string $email): void { $this->email = $email; }

    public function getMdp(): string { return $this->mdp; }
    public function setMdp(string $mdp): void { $this->mdp = $mdp; }

    public function getRole(): string { return $this->role; }
    public function setRole(string $role): void { $this->role = $role; }

    public function getNumeroPhone(): ?string { return $this->numeroPhone; }
    public function setNumeroPhone(?string $phone): void { $this->numeroPhone = $phone; }

    public function getDateInscription(): \DateTimeInterface { return $this->dateInscription; }
    public function setDateInscription(\DateTimeInterface $date): void { $this->dateInscription = $date; }

    // UserInterface
    public function getUserIdentifier(): string { return $this->email; }

    public function getRoles(): array
    {
        return match($this->role) {
            'admin'      => ['ROLE_ADMIN', 'ROLE_USER'],
            'entreprise' => ['ROLE_ENTREPRISE', 'ROLE_USER'],
            default      => ['ROLE_USER'],
        };
    }

    public function eraseCredentials(): void {}

    // PasswordAuthenticatedUserInterface
    public function getPassword(): ?string { return $this->mdp; }
}
