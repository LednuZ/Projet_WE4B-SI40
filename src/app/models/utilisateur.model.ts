export interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  mdp?: string;
  role: 'admin' | 'vendeur' | 'entreprise';
  numero_phone?: string;
  date_inscription: string;
}