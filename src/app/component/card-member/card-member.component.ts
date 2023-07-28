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
import { MemberDto } from '../../dto/member.dto';
import { UserDto } from '../../dto/user.dto';
import { UserService } from '../../service/user.service';
import { CardUserComponent } from '../card-user/card-user.component';
import { CommonModule } from '@angular/common';
import { ProjectAclPipe } from '../../pipe/project-acl.pipe';

@Component({
  selector: 'app-card-member',
  templateUrl: './card-member.component.html',
  styleUrls: ['./card-member.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CardUserComponent,
    ProjectAclPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardMemberComponent implements OnInit, OnDestroy {

  /**
   * State
   */
  @Input() member!: MemberDto;
  $name: WritableSignal<string> = signal('');

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
      this.userService.read({ ids: [this.member.userId] }).subscribe(users => this.onNextUsers(users)),
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
  }
}
