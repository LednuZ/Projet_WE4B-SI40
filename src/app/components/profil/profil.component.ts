import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateurService } from '../../services/utilisateur.service';
import { AuthService } from '../../services/auth.service';
import { AvisService } from '../../services/avis.service';
import { Utilisateur } from '../../models/utilisateur.model';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  utilisateur: Utilisateur | null = null;
  loading = true;

  profilForm!: FormGroup;
  passwordForm!: FormGroup;

  profilMessage = '';
  profilMessageType: 'success' | 'error' = 'success';

  passwordMessage = '';
  passwordMessageType: 'success' | 'error' = 'success';

  showDeleteModal = false;
  deletePassword = '';
  deleteError = '';
  deleteLoading = false;

  avisRecus: any[] = [];
  avisStats: any = null;

  constructor(
    private fb: FormBuilder,
    private utilisateurService: UtilisateurService,
    private authService: AuthService,
    private avisService: AvisService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profilForm = this.fb.group({
      username:     ['', [Validators.minLength(3)]],
      nom:          ['', Validators.required],
      prenom:       ['', Validators.required],
      email:        ['', [Validators.required, Validators.email]],
      numero_phone: [''],
    });

    this.passwordForm = this.fb.group({
      ancien_mdp:      ['', Validators.required],
      nouveau_mdp:     ['', [Validators.required, Validators.minLength(8)]],
      confirmation_mdp: ['', Validators.required],
    });

    this.loadProfil();
  }

  loadProfil(): void {
    this.utilisateurService.getProfil().subscribe({
      next: (user) => {
        this.utilisateur = user;
        this.loading = false;
        this.profilForm.patchValue({
          username:     user.username ?? '',
          nom:          user.nom,
          prenom:       user.prenom,
          email:        user.email,
          numero_phone: user.numero_phone ?? '',
        });
        this.avisService.getAvisVendeur(user.id_utilisateur).subscribe({
          next: (data: any) => {
            this.avisRecus = data.avis;
            this.avisStats = data.stats;
          },
          error: () => {}
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateProfil(): void {
    if (this.profilForm.invalid) return;

    this.utilisateurService.updateProfil(this.profilForm.value).subscribe({
      next: (res) => {
        this.profilMessage = res.message || 'Profil mis à jour avec succès';
        this.profilMessageType = 'success';
        if (this.utilisateur) {
          this.utilisateur = { ...this.utilisateur, ...this.profilForm.value };
          localStorage.setItem('currentUser', JSON.stringify(this.utilisateur));
        }
        setTimeout(() => (this.profilMessage = ''), 4000);
      },
      error: (err) => {
        this.profilMessage = err.error?.message || 'Erreur lors de la mise à jour';
        this.profilMessageType = 'error';
        setTimeout(() => (this.profilMessage = ''), 4000);
      },
    });
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) return;

    const { ancien_mdp, nouveau_mdp, confirmation_mdp } = this.passwordForm.value;

    if (nouveau_mdp !== confirmation_mdp) {
      this.passwordMessage = 'Les mots de passe ne correspondent pas';
      this.passwordMessageType = 'error';
      setTimeout(() => (this.passwordMessage = ''), 4000);
      return;
    }

    this.utilisateurService.updatePassword({ ancien_mdp, nouveau_mdp }).subscribe({
      next: (res) => {
        this.passwordMessage = res.message || 'Mot de passe mis à jour avec succès';
        this.passwordMessageType = 'success';
        this.passwordForm.reset();
        setTimeout(() => (this.passwordMessage = ''), 4000);
      },
      error: (err) => {
        this.passwordMessage = err.error?.message || 'Erreur lors du changement de mot de passe';
        this.passwordMessageType = 'error';
        setTimeout(() => (this.passwordMessage = ''), 4000);
      },
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
    this.deletePassword = '';
    this.deleteError = '';
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.deletePassword) {
      this.deleteError = 'Veuillez saisir votre mot de passe';
      return;
    }
    this.deleteLoading = true;
    this.deleteError = '';

    this.utilisateurService.deleteCompte(this.deletePassword).subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.deleteError = err.error?.message || 'Erreur lors de la suppression';
        this.deleteLoading = false;
      },
    });
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      admin:       'Administrateur',
      particulier: 'Particulier',
      entreprise:  'Professionnel',
    };
    return labels[role] || role;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day:   '2-digit',
      month: 'long',
      year:  'numeric',
    });
  }
}
