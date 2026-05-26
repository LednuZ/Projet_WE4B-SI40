import { Utilisateur } from './utilisateur.model';
import { Version } from './vehicule.model';

export interface Annonce {
  id_annonce: number;
  id_utilisateur: number;
  id_version: number;
  prix: number;
  annee_circulation: number;
  kilometrage: number;
  etat?: string;
  couleur?: string;
  sellerie?: string;
  finition?: string;
  nombre_proprietaire?: number;
  premiere_main: boolean;
  controle_technique?: string;
  provenance?: string;
  localisation?: string;
  description?: string;
  statut: string;
  date_publication?: string;
  date_creation: string;
  date_modification: string;
  date_vente?: string;
  commentaire_admin?: string;
  // Jointures
  vendeur?: Utilisateur;
  version?: Version;
  photos?: Photo[];
}

export interface Photo {
  id_photo: number;
  id_annonce: number;
  url_photo: string;
  date_ajout: string;
}