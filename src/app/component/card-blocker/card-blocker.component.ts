import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BlockerDto } from '../../dto/blocker.dto';
import { CommonModule } from '@angular/common';
import { CardUserComponent } from '../card-user/card-user.component';
import { IconComponent } from '../icon/icon.component';
import { InitialsPipe } from '../../pipe/initials.pipe';
import { ProjectAclEnum } from '../../enum/project-acl.enum';

@Component({
  selector: 'app-card-blocker',
  templateUrl: './card-blocker.component.html',
  styleUrls: ['./card-blocker.component.scss'],
  imports: [
    CommonModule,
    CardUserComponent,
    IconComponent,
    InitialsPipe,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardBlockerComponent {

  /**
   * Constants
   */
  readonly PROJECT_ACL_MANAGER: ProjectAclEnum = ProjectAclEnum.manager;

  /**
   * State
   */
  @Input() blocker!: BlockerDto;
  @Input() acl!: ProjectAclEnum;

}
