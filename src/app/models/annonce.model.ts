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

  // Champs joints renvoyés par l'API
  version_nom?: string;
  transmission?: string;
  boite_vitesse?: string;
  nombre_places?: number;
  nombre_portes?: number;
  nombre_rapport?: number;
  vitesse_max?: number;
  consommation_urbaine?: number;
  consommation_extra_urbaine?: number;
  consomation_mixte?: number;
  emission_CO2?: number;
  Norme_euro?: string;
  Crit_air?: number;
  largeur_sans_retros?: number;
  hauteur?: number;
  empattement?: number;
  poids_vide?: number;
  suspension_avant?: string;
  suspension_arriere?: string;
  freins_avant?: string;
  freins_arriere?: string;
  diametre_braquage?: number;

  // Réservoir
  carburant?: string;
  reservoir_volume?: number;

  // Coffre
  coffre_volume?: number;

  // Moteur
  moteur_nom?: string;
  puissance_DIN?: number;
  puissance_fiscale?: number;
  cylindree?: number;
  couple_cumul?: number;
  nombre_cylindre?: number;
  nombre_soupapes_cyclindre?: number;
  alimentation?: string;
  type_suralimentation?: string;

  // Génération
  id_generation?: number;
  generation_nom?: string;
  generation_date_sortie?: string;

  // Modèle
  id_modele?: number;
  modele_nom?: string;
  modele_annee?: string;
  type_nom?: string;

  // Marque
  id_marque?: number;
  marque_nom?: string;
  marque_pays?: string;

  // Vendeur
  vendeur_id?: number;
  vendeur_display?: string;
  vendeur_prenom?: string;
  vendeur_nom?: string;
  vendeur_note?: number;

  // Photo
  photo_principale?: string;
  photos?: Photo[];
}

export interface Photo {
  id_photo: number;
  id_annonce: number;
  url_photo: string;
  date_ajout: string;
}