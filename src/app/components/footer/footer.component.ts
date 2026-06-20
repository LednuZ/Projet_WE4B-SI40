import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  emailAddress: string = '';
  newsletterStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  activeLegalModal: 'privacy' | 'terms' | 'cookies' | 'contact' | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Handles the newsletter subscription form submission.
   * Simulates an API call with senior-level status feedback.
   */
  subscribeNewsletter(form: NgForm): void {
    if (form.invalid) return;

    this.newsletterStatus = 'loading';

    // Simulate API delay (1.2 seconds)
    setTimeout(() => {
      // Mocking a successful response (could add simple validation or error simulation)
      if (this.emailAddress.includes('error')) {
        this.newsletterStatus = 'error';
      } else {
        this.newsletterStatus = 'success';
        this.emailAddress = '';
        form.resetForm();

        // Reset status back to idle after 4 seconds to allow new submissions
        setTimeout(() => {
          this.newsletterStatus = 'idle';
        }, 4000);
      }
    }, 1200);
  }

  /**
   * Opens the requested legal modal view
   */
  openLegalModal(type: 'privacy' | 'terms' | 'cookies' | 'contact'): void {
    this.activeLegalModal = type;
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }

  /**
   * Closes the currently active legal modal
   */
  closeLegalModal(): void {
    this.activeLegalModal = null;
    document.body.style.overflow = ''; // Restore background scrolling
  }

  /**
   * Resolves the title of the legal modal view
   */
  getLegalTitle(): string {
    switch (this.activeLegalModal) {
      case 'privacy':
        return 'Politique de Confidentialité';
      case 'terms':
        return "Conditions Générales d'Utilisation";
      case 'cookies':
        return 'Politique des Cookies';
      case 'contact':
        return 'Contactez-nous';
      default:
        return '';
    }
  }

  /**
   * Resolves the HTML body content of the legal modal view
   */
  getLegalBody(): string {
    switch (this.activeLegalModal) {
      case 'privacy':
        return `
          <h4>1. Collecte de données</h4>
          <p>Chez AutoMarket, nous collectons les données indispensables au fonctionnement de nos services : email, nom, prénom, numéro de téléphone, ainsi que les caractéristiques des annonces publiées.</p>
          <h4>2. Utilisation des données</h4>
          <p>Vos informations sont traitées dans le but unique d'assurer la gestion de vos annonces, de sécuriser la messagerie interne et d'améliorer les performances de notre Showroom digital.</p>
          <h4>3. Partage et Stockage</h4>
          <p>Vos données de profil ne sont jamais partagées à des fins marketing tierces. Elles sont stockées en Europe sur des serveurs sécurisés et chiffrés.</p>
        `;
      case 'terms':
        return `
          <h4>1. Objet de la plateforme</h4>
          <p>AutoMarket met en relation des acheteurs et vendeurs (professionnels et particuliers) de véhicules. La publication d'une annonce requiert des descriptions honnêtes et conformes à l'état réel du bien.</p>
          <h4>2. Responsabilité</h4>
          <p>L'utilisateur est seul responsable du contenu de ses publications et des transactions financières réalisées. Nous conseillons de procéder à des vérifications usuelles avant tout achat.</p>
          <h4>3. Modération</h4>
          <p>Toute annonce suspecte ou non conforme sera supprimée sur-le-champ par nos équipes de modération.</p>
        `;
      case 'cookies':
        return `
          <h4>Qu'est-ce qu'un cookie ?</h4>
          <p>Un cookie est un petit fichier texte déposé sur votre ordinateur lors de la visite d'un site. Ils facilitent votre navigation.</p>
          <h4>Nos Cookies</h4>
          <p>Nous utilisons uniquement des cookies de session indispensables (maintien de votre connexion) et des cookies de statistiques anonymes pour mesurer l'audience et affiner notre ergonomie.</p>
          <h4>Gestion</h4>
          <p>Vous pouvez vous opposer à l'enregistrement des cookies ou configurer votre navigateur pour vous alerter avant toute installation.</p>
        `;
      case 'contact':
        return `
          <h4>Support Client AutoMarket</h4>
          <p>Nos conseillers et experts automobiles sont à votre disposition pour vous accompagner dans vos démarches d'achat et de vente.</p>
          <p><strong>Email direct :</strong> contact@automarket.fr</p>
          <p><strong>Téléphone :</strong> 01 45 78 89 00 (Lundi au Vendredi, 9h00 - 18h00)</p>
          <p><strong>Siège Social :</strong> 42 Avenue des Champs-Élysées, 75008 Paris, France</p>
        `;
      default:
        return '';
    }
  }
}
