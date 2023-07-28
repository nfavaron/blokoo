import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { Subscription } from 'rxjs';
import { UserDto } from '../../dto/user.dto';
import { UserService } from '../../service/user.service';
import { InitialsPipe } from '../../pipe/initials.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-user',
  templateUrl: './card-user.component.html',
  styleUrls: ['./card-user.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InitialsPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardUserComponent implements OnInit, OnDestroy {

  /**
   * Inputs
   */
  @Input() userId!: string;

  /**
   * State
   */
  $name: WritableSignal<string> = signal('');
  $photoUrl: WritableSignal<string> = signal('')

  /**
   * Dependencies
   */
  private userService = inject(UserService);

  /**
   * Subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    // User subscription
    this.subscriptions.push(
      this.userService.read({ ids: [this.userId] }).subscribe(users => this.onNextUsers(users)),
    );
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Received next users
   */
  onNextUsers(users: UserDto[]): void {

    if (!users[0]) {

      return;
    }

    this.$name.set(users[0].name);
    this.$photoUrl.set(users[0].photoUrl);
  }
}
