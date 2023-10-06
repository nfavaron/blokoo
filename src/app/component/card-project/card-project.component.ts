import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { InitialsPipe } from '../../pipe/initials.pipe';
import { ProjectDto } from '../../dto/project.dto';
import { ProjectAclEnum } from '../../enum/project-acl.enum';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card-project',
  templateUrl: './card-project.component.html',
  styleUrls: ['./card-project.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IconComponent,
    InitialsPipe,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProjectComponent {

  /**
   * Constants
   */
  readonly PROJECT_ACL_INVITED: ProjectAclEnum = ProjectAclEnum.invited;
  readonly PROJECT_ACL_MEMBER: ProjectAclEnum = ProjectAclEnum.member;

  /**
   * State
   */
  @Input() project!: ProjectDto;
  @Input() acl!: ProjectAclEnum;

  /**
   * Events
   */
  @Output() clickInvitation: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Clicked on an invitation button
   */
  onClickInvitation(isAccepted: boolean): void {

    this.clickInvitation.emit(isAccepted);
  }
}
