import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';
import { UserDto } from './dto/user.dto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  /**
   * State
   */
  $isAuthenticated: WritableSignal<boolean> = signal(false);

  /**
   * Dependencies
   */
  private userAuthenticationService = inject(AuthenticationService);

  /**
   * Constructor
   */
  constructor() {

    // Subscribing in constructor as OnInit/OnDestroy does not make sense in AppComponent
    this.userAuthenticationService.user().subscribe(user => this.onNextUser(user));
  }

  /**
   * Next user
   */
  private onNextUser(user: UserDto): void {

    this.$isAuthenticated.set(!!user.id);
  }
}
