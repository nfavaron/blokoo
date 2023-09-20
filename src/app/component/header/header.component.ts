import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractComponent } from '../abstract.component';
import { HeaderService } from '../../service/header.service';
import { HeaderInterface } from '../../interface/header.interface';
import { BlokooComponent } from '../blokoo/blokoo.component';
import { IconComponent } from '../icon/icon.component';
import { LogoComponent } from '../logo/logo.component';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BlokooComponent,
    IconComponent,
    LogoComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends AbstractComponent implements OnInit {

  /**
   * State (public)
   */
  $header: WritableSignal<HeaderInterface> = signal({
    routerLink: ['/'],
    title: '',
  });

  /**
   * Dependencies
   */
  private userAuthenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private headerService = inject(HeaderService);

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    // Subscribe to observables
    this.subscribe(
      this.headerService.header(),
      (header) => this.onNextHeader(header),
    );
  }

  /**
   * Clicked signout button
   */
  async onClickSignOut(): Promise<void> {

    // Sign out
    await this.userAuthenticationService.signOut();

    // Notification
    this.messageService.message({
      type: 'success',
      text: `Bye bye ${this.userAuthenticationService.userSnapshot.name.split(' ')[0]}!`
    });

    // Redirect to home
    await this.router.navigate(['/']);
  }

  /**
   * Next header
   */
  private onNextHeader(header: HeaderInterface): void {

    // Set new header
    this.$header.set(header);
  }
}
