import { Utilisateur } from './utilisateur.model';

export interface AvisUtilisateur {
  id_avis_utilisateur: number;
  id_redacteur: number;
  id_vendeur: number;
  note: number;
  contenu?: string;
  date_avis: string;
  // Jointures
  redacteur?: Utilisateur;
  vendeur?: Utilisateur;
}

export interface AvisModele {
  id_avis_modele: number;
  id_redacteur: number;
  id_modele: number;
  note: number;
  contenu?: string;
  date_avis: string;
  // Jointures
  redacteur?: Utilisateur;
}