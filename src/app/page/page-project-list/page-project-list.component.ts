import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../service/project.service';
import { ProjectAclEnum } from '../../enum/project-acl.enum';
import { AuthenticationService } from '../../service/authentication.service';
import { MessageService } from '../../service/message.service';
import { ProjectDto } from '../../dto/project.dto';
import { AclDto } from '../../dto/acl.dto';

@Component({
  selector: 'app-project-page-list',
  templateUrl: './page-project-list.component.html',
  styleUrls: ['./page-project-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageProjectListComponent implements OnInit, OnDestroy {

  /**
   * Constants
   */
  readonly PROJECT_ACL_INVITED: ProjectAclEnum = ProjectAclEnum.invited;
  readonly PROJECT_ACL_MEMBER: ProjectAclEnum = ProjectAclEnum.member;

  /**
   * State
   */
  $isLoading: WritableSignal<boolean> = signal(true);
  $projects: WritableSignal<ProjectDto[]> = signal([]);
  $acl: WritableSignal<{ [projectId: string]: AclDto; }> = signal({});

  /**
   * Dependencies
   */
  private projectService = inject(ProjectService);
  private authenticationService = inject(AuthenticationService);
  private messageService = inject(MessageService);

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    // Projects
    this.subscriptions.push(
      this.projectService.read({ aclMin: ProjectAclEnum.invited }).subscribe(projects => {

        this.$projects.set(projects);
        this.$isLoading.set(false);
      })
    );

    // ACLs
    this.subscriptions.push(
      this.projectService.selectAclProjects().subscribe(acls => {

        const aclNext: { [projectId: string]: AclDto; } = {};

        acls.forEach(acl => aclNext[acl.projectId] = acl);

        this.$acl.set(aclNext);
      }),
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
   * Clicked "add project" button
   */
  onClickAddProject(): void {

    this
      .projectService
      .write({
        id: '',
        name: 'Project ' + String.fromCharCode(65 + Math.round(26 * Math.random())),
        waitingFor: 'anyone',
        to: 'add a blocker',
        color: '#333333',
        createUserId: this.authenticationService.userSnapshot.id,
        createTimestamp: Date.now(),
        sinceTimestamp: Date.now(),
      })
      .then((project) => this.messageService.notify('success', 'Project added!'));
  }

  /**
   * Clicked on an invitation button
   */
  onClickInvitation(projectId: string, isAccepted: boolean): void {

    console.log('onClickInvitation');

    /*this
    .aclService
    .setAclProject(this.userAuthenticationService.userSnapshot.id, {
      ...this.aclProject[projectId],
      acl: isAccepted === true ? ProjectAclEnum.member : ProjectAclEnum.refused,
    })
    .then(() => {

      if (isAccepted === false) {

        // Notify
        this.messageService.display('failure', 'Invitation rejected!');

        return;
      }

      // Get project's members
      this
      .memberService
      .selectAll(projectId)
      .subscribe(members => {

        const promises: Promise<void>[] = [];

        // For each member
        members.forEach(member => {

          // User is the member
          if (this.userAuthenticationService.userSnapshot.id === member.userId) {

            return;
          }

          // Set permissions from user to member
          promises.push(
            this.aclService.setAclUser(this.userAuthenticationService.userSnapshot.id, member.userId, projectId),
          );

          // Set permissions from member to user
          promises.push(
            this.aclService.setAclUser(member.userId, this.userAuthenticationService.userSnapshot.id, projectId),
          );
        });

        if (promises.length === 0) {

          return;
        }

        Promise
        .all(promises)
        .then(() => {

          // Notify
          this.messageService.display('success', 'Invitation accepted!');
        });
      });
    });*/
  }
}
