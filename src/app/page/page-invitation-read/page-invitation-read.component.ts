import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectAclEnum } from '../../enum/project-acl.enum';
import { UserConfig } from '../../config/user.config';
import { AuthenticationService } from '../../service/authentication.service';
import { InvitationService } from '../../service/invitation.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from '../../service/message.service';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../service/project.service';
import { InvitationDto } from '../../dto/invitation.dto';
import { ProjectDto } from '../../dto/project.dto';
import { AbstractComponent } from '../../component/abstract.component';

@Component({
  selector: 'app-page-invitation-read',
  templateUrl: './page-invitation-read.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageInvitationReadComponent extends AbstractComponent implements OnInit {

  /**
   * Dependencies
   */
  private userConfig = inject(UserConfig);
  private authenticationService = inject(AuthenticationService);
  private invitationService = inject(InvitationService);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.subscribe(
      this.invitationService.read({ id: this.route.snapshot.params['invitationId'] }),
      (invitations) => this.onNextInvitations(invitations),
    );
  }

  /**
   * Return validation error message if invitation is invalid, else return empty string
   */
  private validate(invitation: InvitationDto): string {

    // User route param does not match invitation fromUserId
    if (this.route.snapshot.params['fromUserId'] !== invitation.fromUserId) {

      // Give false information to the potential attacker
      return 'Sorry this invitation has expired!';
    }

    // Invitation expired
    if (Date.now() > invitation.expireTimestamp) {

      // Give real information, the invitation really expired
      return 'Sorry this invitation has expired!';
    }

    return '';
  }

  /**
   * Next invitations
   */
  private onNextInvitations(invitations: InvitationDto[]): void {

    // No invitations found or too many found
    if (invitations.length !== 0) {

      // Redirect to user home
      this.router.navigate([this.userConfig.route.home]);

      return;
    }

    const invitation = invitations[0];

    const errorMessage = this.validate(invitation);

    if (errorMessage) {

      // Notify
      this.messageService.message({
        type: 'failure',
        text: errorMessage,
      });

      // Redirect to user home
      this.router.navigate([this.userConfig.route.home]);

      return;
    }

    this
      .projectService
      .read({ aclMin: ProjectAclEnum.removed }) // Load user's ACL projects
      .pipe(
        take(1),
        map(projects => {

          // Keep an index of projects
          const projectIndex: { [projectId: string]: ProjectDto; } = {};
          projects.forEach(project => projectIndex[project.id] = project);

          // For each project included in the invitation
          return Promise.all(
            invitation.forProjectIds.map(projectId => {

              // User is already a member of the project
              if (!!projectIndex[projectId]) {

                // Silently skip
                return Promise.resolve();
              }

              // Set user project ACL
              return this.projectService.setAclProject(
                this.authenticationService.userSnapshot.id,
                {
                  projectId,
                  acl: ProjectAclEnum.invited,
                  invitationId: invitation.id,
                },
              )

              // Add member to project
              .then(() => this.projectService.addMember(projectIndex[projectId], {
                userId: this.authenticationService.userSnapshot.id,
                projectId: projectId,
                createTimestamp: Date.now(),
                acl: ProjectAclEnum.invited,
              }));
            }),
          )

          // All projects have been updated
          .then(() => {

            // Notify
            this.messageService.message({
              type: 'notice',
              text: 'Invitations received!',
            });

            // Redirect to user home
            this.router.navigate([this.userConfig.route.home]);
          });
        }),
      );
  }
}
