import { Utilisateur } from './utilisateur.model';

export interface Message {
  id_message: number;
  id_expediteur: number;
  id_destinataire: number;
  id_annonce: number;
  contenu: string;
  lu: boolean;
  date_envoi: string;
  // Jointures
  expediteur?: Utilisateur;
  destinataire?: Utilisateur;
}