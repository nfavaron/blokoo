import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { UserDto } from '../../dto/user.dto';
import { UserService } from '../../service/user.service';
import { InitialsPipe } from '../../pipe/initials.pipe';
import { CommonModule } from '@angular/common';
import { AbstractComponent } from '../abstract.component';

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
export class CardUserComponent extends AbstractComponent implements OnInit {

  /**
   * Inputs
   */
  @Input() userId!: string;

  /**
   * State
   */
  $name: WritableSignal<string> = signal('?');
  $photoUrl: WritableSignal<string> = signal('')

  /**
   * Dependencies
   */
  private userService = inject(UserService);

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    // User
    this.subscribe(
      this.userService.read({ ids: [this.userId] }),
      (users) => this.onNextUsers(users),
    );
  }

  /**
   * Next users
   */
  private onNextUsers(users: UserDto[]): void {

    if (!users[0]) {

      return;
    }

    this.$name.set(users[0].name);
    this.$photoUrl.set(users[0].photoUrl);
  }
}
