import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../service/project.service';
import { ProjectAclEnum } from '../../enum/project-acl.enum';
import { AuthenticationService } from '../../service/authentication.service';
import { MessageService } from '../../service/message.service';
import { ProjectDto } from '../../dto/project.dto';
import { AclDto } from '../../dto/acl.dto';
import { IconComponent } from '../../component/icon/icon.component';
import { HeaderService } from '../../service/header.service';
import { FooterService } from '../../service/footer.service';
import { AbstractComponent } from '../../component/abstract.component';
import { ActionEnum } from '../../enum/action.enum';
import { TabEnum } from '../../enum/tab.enum';
import { InitialsPipe } from '../../pipe/initials.pipe';
import { CardProjectComponent } from '../../component/card-project/card-project.component';

@Component({
  selector: 'app-project-page-list',
  templateUrl: './page-project-list.component.html',
  styleUrls: ['./page-project-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IconComponent,
    InitialsPipe,
    CardProjectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageProjectListComponent extends AbstractComponent implements OnInit {

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
  private headerService = inject(HeaderService);
  private footerService = inject(FooterService);
  private router = inject(Router);

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    // Update header
    this.headerService.header({
      routerLink: ['/'],
      title: '',
    });

    // Update footer
    this.footerService.footer({
      tabs: [{
        uid: TabEnum.projectList,
        label: 'Projects',
      }],
      actions: [{
        uid: ActionEnum.projectNew,
        icon: 'add',
        label: 'New project',
      },{
        uid: ActionEnum.invitationNew,
        icon: 'invite',
        label: 'Invite to projects',
      }],
    });

    // Tab
    this.footerService.tab(TabEnum.projectList);

    // Action
    this.subscribe(
      this.footerService.action(),
      (action) => this.onNextAction(action),
    );

    // Projects
    this.subscribe(
      this.projectService.read({ aclMin: ProjectAclEnum.invited }),
      (projects) => this.onNextProjects(projects),
    );

    // ACLs
    this.subscribe(
      this.projectService.selectAclProjects(),
      (acls) => this.onNextAcls(acls),
    );
  }

  /**
   * Next action
   */
  private onNextAction(action: ActionEnum): void {

    if (action === ActionEnum.projectNew) {

      // TODO[nico]side panel form
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
        .then((project) => this.messageService.message({
          type: 'success',
          text: 'Project added!',
        }));

      return;
    }

    if (action === ActionEnum.invitationNew) {

      this.router.navigate(['/invitation']);
    }
  }

  /**
   * Next projects
   */
  private onNextProjects(projects: ProjectDto[]): void {

    this.$projects.set(projects);
    this.$isLoading.set(false);
  }

  /**
   * Next ACLs
   */
  private onNextAcls(acls: AclDto[]): void {

    const aclNext: { [projectId: string]: AclDto; } = {};

    acls.forEach(acl => aclNext[acl.projectId] = acl);

    this.$acl.set(aclNext);
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
