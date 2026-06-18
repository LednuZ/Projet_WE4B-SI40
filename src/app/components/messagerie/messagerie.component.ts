import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { AnnonceService } from '../../services/annonce.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.component.html',
  styleUrls: ['./messagerie.component.css']
})
export class MessagerieComponent implements OnInit, AfterViewChecked {

  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  conversations: any[] = [];
  selectedConv: any = null;
  messages: any[] = [];
  interlocuteur: any = null;

  newMessage = '';
  loadingConvs = true;
  loadingMessages = false;
  sending = false;
  errorMsg = '';

  currentUserId = 0;
  private shouldScroll = false;

  // Nouvelle conversation depuis annonce-detail
  pendingAnnonceId: number | null = null;
  pendingDestinataire: number | null = null;
  pendingAnnonceTitre = '';

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private annonceService: AnnonceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserId = user.id_utilisateur;
    }

    const params = this.route.snapshot.queryParams;
    if (params['annonce'] != null && params['destinataire'] != null) {
      this.pendingAnnonceId    = Number(params['annonce']);
      this.pendingDestinataire = Number(params['destinataire']);
    }

    this.loadConversations();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  loadConversations(): void {
    this.loadingConvs = true;
    this.messageService.getConversations().subscribe({
      next: (convs) => {
        this.conversations = convs;
        this.loadingConvs = false;

        if (this.pendingAnnonceId !== null && this.pendingDestinataire !== null) {
          const existing = convs.find(
            c => c.id_annonce == this.pendingAnnonceId && c.interlocuteur_id == this.pendingDestinataire
          );
          if (existing) {
            this.selectConversation(existing);
          } else {
            this.initNewConversation();
          }
        }
      },
      error: () => {
        this.loadingConvs = false;
      }
    });
  }

  private initNewConversation(): void {
    this.annonceService.getAnnonce(this.pendingAnnonceId!).subscribe({
      next: (annonce) => {
        this.selectedConv = {
          interlocuteur_id:    this.pendingDestinataire,
          nom:                 annonce.vendeur_nom ?? '',
          prenom:              annonce.vendeur_prenom ?? '',
          id_annonce:          this.pendingAnnonceId,
          annonce_titre:       `${annonce.marque_nom} ${annonce.modele_nom}`,
          nb_non_lus:          0,
          dernier_message:     '',
          date_dernier_message: '',
        };
        this.interlocuteur = {
          id_utilisateur: this.pendingDestinataire,
          nom:            annonce.vendeur_nom ?? '',
          prenom:         annonce.vendeur_prenom ?? '',
        };
        this.messages = [];
      },
      error: () => {
        this.errorMsg = 'Impossible de charger les informations de l\'annonce';
      }
    });
  }

  selectConversation(conv: any): void {
    this.selectedConv = conv;
    this.messages = [];
    this.errorMsg = '';
    this.newMessage = '';
    this.loadingMessages = true;

    this.messageService.getMessages(conv.id_annonce, conv.interlocuteur_id).subscribe({
      next: (data) => {
        this.messages = data.messages;
        this.interlocuteur = data.interlocuteur;
        this.loadingMessages = false;
        this.shouldScroll = true;

        if (conv.nb_non_lus > 0) {
          this.messageService.markAsRead(conv.id_annonce, conv.interlocuteur_id).subscribe({
            next: () => {
              conv.nb_non_lus = 0;
            }
          });
        }
      },
      error: () => {
        this.loadingMessages = false;
        this.errorMsg = 'Erreur lors du chargement des messages';
      }
    });
  }

  sendMessage(): void {
    const contenu = this.newMessage.trim();
    if (!contenu || !this.selectedConv || this.sending) return;

    this.sending = true;
    const payload = {
      contenu,
      id_annonce:      this.selectedConv.id_annonce,
      id_destinataire: this.selectedConv.interlocuteur_id,
    };

    this.messageService.sendMessage(payload).subscribe({
      next: () => {
        this.newMessage = '';
        this.sending = false;
        // Rechargement messages + liste conversations
        this.messageService.getMessages(this.selectedConv.id_annonce, this.selectedConv.interlocuteur_id).subscribe({
          next: (data) => {
            this.messages = data.messages;
            this.shouldScroll = true;
          }
        });
        this.messageService.getConversations().subscribe({
          next: (convs) => {
            this.conversations = convs;
            // Resélectionner la conversation active dans la nouvelle liste
            const updated = convs.find(
              c => c.id_annonce == this.selectedConv.id_annonce &&
                   c.interlocuteur_id == this.selectedConv.interlocuteur_id
            );
            if (updated) this.selectedConv = updated;
          }
        });
      },
      error: (err) => {
        this.sending = false;
        this.errorMsg = err.error?.message || 'Erreur lors de l\'envoi du message';
      }
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    try {
      this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }

  initiales(nom: string, prenom: string): string {
    return ((prenom?.[0] ?? '') + (nom?.[0] ?? '')).toUpperCase();
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0
    }).format(prix);
  }

  formatKm(km: number): string {
    return new Intl.NumberFormat('fr-FR').format(km) + ' km';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  }

  formatHeure(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  isEnvoyePar(msg: any): boolean {
    return Number(msg.id_expediteur) === this.currentUserId;
  }

  totalNonLus(): number {
    return this.conversations.reduce((acc, c) => acc + Number(c.nb_non_lus || 0), 0);
  }
}
