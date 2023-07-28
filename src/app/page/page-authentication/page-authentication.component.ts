import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserConfig } from '../../config/user.config';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-page-authentication',
  templateUrl: './page-authentication.component.html',
  styleUrls: ['./page-authentication.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageAuthenticationComponent {

  /**
   * Dependencies
   */
  private userAuthenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private userConfig = inject(UserConfig);
  private messageService = inject(MessageService);

  /**
   * Clicked signin button
   */
  async onClickSignIn(providerName: string): Promise<void> {

    // Sign in
    await this.userAuthenticationService.signIn(providerName);

    // Redirect to home
    await this.router.navigate([this.userConfig.route.home]);

    // Notification
    this.messageService.notify('success', `Hi ${this.userAuthenticationService.userSnapshot.name.split(' ')[0]}!`);
  }
}
