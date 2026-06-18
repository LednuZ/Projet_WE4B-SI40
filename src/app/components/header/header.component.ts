import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  nonLus = 0;
  private sub = new Subscription();

  constructor(
    public authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.chargerNonLus();

    // Rafraîchit le badge à chaque changement de page
    this.sub.add(
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd)
      ).subscribe(() => this.chargerNonLus())
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private chargerNonLus(): void {
    if (!this.authService.isLoggedIn()) {
      this.nonLus = 0;
      return;
    }
    this.messageService.getNonLus().subscribe({
      next: count => (this.nonLus = count),
      error: ()   => (this.nonLus = 0)
    });
  }

  logout(): void {
    this.authService.logout();
    this.nonLus = 0;
    this.router.navigate(['/']);
  }
}
