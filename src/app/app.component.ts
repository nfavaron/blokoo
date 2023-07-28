import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';
import { UserDto } from './dto/user.dto';
import { Router } from '@angular/router';
import { MessageService } from './service/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  /**
   * State
   */
  $user: WritableSignal<UserDto> = signal({
    id: '',
    name: '',
    email: '',
    photoUrl: '',
  });

  /**
   * Dependencies
   */
  private userAuthenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  /**
   * Constructor
   */
  constructor() {

    // Subscribing in constructor as OnInit/OnDestroy does not make sense in AppComponent
    this.userAuthenticationService.user$.subscribe(user => this.onNextUser(user));
  }

  /**
   * Received next user
   */
  onNextUser(user: UserDto): void {

    this.$user.set(user);
  }

  /**
   * Clicked signout button
   */
  async onClickSignOut(): Promise<void> {

    // Sign out
    await this.userAuthenticationService.signOut();

    // Notification
    this.messageService.notify('success', `Bye bye ${this.userAuthenticationService.userSnapshot.name.split(' ')[0]}!`);

    // Redirect to home
    await this.router.navigate(['/']);
  }
}
