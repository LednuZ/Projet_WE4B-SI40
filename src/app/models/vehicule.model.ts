export interface Marque {
  id_marque: number;
  nom: string;
  continent?: string;
  pays?: string;
  date_creation?: string;
  description?: string;
  createur?: string;
}

export interface Type {
  id_type: number;
  nom: string;
  description?: string;
}

export interface Modele {
  id_modele: number;
  id_marque: number;
  id_type: number;
  nom: string;
  annee_creation?: string;
  // Jointures
  marque?: Marque;
  type?: Type;
}

export interface Generation {
  id_generation: number;
  id_modele: number;
  nom?: string;
  date_sortie?: string;
  modele?: Modele;
}

export interface Moteur {
  id_moteur: number;
  id_marque?: number;
  nom: string;
  puissance_fiscale?: number;
  puissance_DIN?: number;
  cylindree?: number;
  couple_cumul?: number;
  nombre_cylindre?: number;
  nombre_soupapes_cyclindre?: number;
  alimentation?: string;
  type_suralimentation?: string;
}

export interface Reservoir {
  id_reservoir: number;
  id_marque?: number;
  volume?: number;
  type?: string;
}

export interface Coffre {
  id_coffre: number;
  volume?: number;
}

export interface Version {
  id_version: number;
  id_generation: number;
  id_reservoir?: number;
  id_coffre?: number;
  nom: string;
  vitesse_max?: number;
  consommation_urbaine?: number;
  consommation_extra_urbaine?: number;
  consomation_mixte?: number;
  emission_CO2?: number;
  Norme_euro?: string;
  Crit_air?: number;
  nombre_portes?: number;
  nombre_places?: number;
  largeur_sans_retros?: number;
  hauteur?: number;
  empattement?: number;
  poids_vide?: number;
  largeur_pneu_avant?: number;
  largeur_pneu_arriere?: number;
  rapport_hL_pneu_avant?: number;
  rapport_hL_pneu_arriere?: number;
  diametre_jante_avant?: number;
  diametre_jante_arriere?: number;
  suspension_avant?: string;
  suspension_arriere?: string;
  freins_avant?: string;
  freins_arriere?: string;
  diametre_braquage?: number;
  transmission?: string;
  boite_vitesse?: string;
  nombre_rapport?: number;
  // Jointures
  generation?: Generation;
  moteurs?: Moteur[];
  reservoir?: Reservoir;
  coffre?: Coffre;
  types?: Type[];
}