import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { MemberDto } from '../../dto/member.dto';
import { UserDto } from '../../dto/user.dto';
import { UserService } from '../../service/user.service';
import { CardUserComponent } from '../card-user/card-user.component';
import { CommonModule } from '@angular/common';
import { ProjectAclPipe } from '../../pipe/project-acl.pipe';
import { AbstractComponent } from '../abstract.component';

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
export class CardMemberComponent extends AbstractComponent implements OnInit {

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
   * @inheritDoc
   */
  ngOnInit(): void {

    // User
    this.subscribe(
      this.userService.read({ ids: [this.member.userId] }),
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
  }
}
