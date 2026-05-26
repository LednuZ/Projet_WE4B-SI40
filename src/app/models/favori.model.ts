import { Annonce } from './annonce.model';

export interface Favori {
  id_utilisateur: number;
  id_annonce: number;
  date_ajout: string;
  // Jointure
  annonce?: Annonce;
}