import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserConfig } from '../../config/user.config';
import { MessageService } from '../../service/message.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-page-authentication',
  templateUrl: './page-authentication.component.html',
  styleUrls: ['./page-authentication.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageAuthenticationComponent {

  /**
   * Form
   */
  signInByEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  /**
   * Dependencies
   */
  private userAuthenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private userConfig = inject(UserConfig);
  private messageService = inject(MessageService);

  /**
   * Submitted "sign in by email" form
   */
  async onSubmitSignInByEmailForm(): Promise<void> {

    // Invalid form
    if (!this.signInByEmailForm.valid) {

      return;
    }

    // Sign in
    await this.userAuthenticationService.signIn('email', String(this.signInByEmailForm.value.email));

    // Redirect to home
    await this.router.navigate(['/']);

    // Notification
    this.messageService.notify('success', `Email sent to ${this.signInByEmailForm.value.email}`);
  }

  /**
   * Clicked "sign in with" button
   */
  async onClickSignInWith(providerName: string): Promise<void> {

    // Sign in
    await this.userAuthenticationService.signIn(providerName);

    // Redirect to home
    await this.router.navigate([this.userConfig.route.home]);

    // Notification
    this.messageService.notify('success', `Hi ${this.userAuthenticationService.userSnapshot.name.split(' ')[0]}!`);
  }
}
