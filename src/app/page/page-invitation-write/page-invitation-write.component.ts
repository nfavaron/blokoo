import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserConfig } from '../../config/user.config';
import { AuthenticationService } from '../../service/authentication.service';
import { ProjectService } from '../../service/project.service';
import { InvitationService } from '../../service/invitation.service';
import { MessageService } from '../../service/message.service';
import { ClipboardService } from '../../service/clipboard.service';
import { ProjectDto } from '../../dto/project.dto';
import { ProjectAclEnum } from '../../enum/project-acl.enum';
import { InvitationConfig } from '../../config/invitation.config';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../../component/icon/icon.component';
import { AbstractComponent } from '../../component/abstract.component';
import { TabEnum } from '../../enum/tab.enum';
import { ActionEnum } from '../../enum/action.enum';
import { FooterService } from '../../service/footer.service';

@Component({
  selector: 'app-page-invitation-write',
  templateUrl: './page-invitation-write.component.html',
  styleUrls: ['./page-invitation-write.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageInvitationWriteComponent extends AbstractComponent implements OnInit {

  /**
   * State
   */
  $step: WritableSignal<number> = signal(0);
  $selectedProject: WritableSignal<{[projectId: string]: boolean}> = signal({});
  $invitationUrl: WritableSignal<string> = signal('');
  $projectId: WritableSignal<string> = signal('');
  $projects: WritableSignal<ProjectDto[]> = signal([]);
  $hasSelection: WritableSignal<boolean> = signal(false);
  $isLoadingProjects: WritableSignal<boolean> = signal(true);

  /**
   * Dependencies
   */
  private invitationConfig = inject(InvitationConfig);
  private userConfig = inject(UserConfig);
  private authenticationService = inject(AuthenticationService);
  private projectService = inject(ProjectService);
  private invitationService = inject(InvitationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clipboardService = inject(ClipboardService);
  private messageService = inject(MessageService);
  private footerService = inject(FooterService);

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    // Update footer
    this.footerService.footer({
      tabs: [],
      actions: [],
    });

    // Projects
    this.subscribe(
      this.projectService.read({ aclMin: ProjectAclEnum.member }),
      (projects) => this.onNextProjects(projects),
    );

    // Move to step 1
    this.step1();
  }

  /**
   * Clicked project
   */
  onClickProject(project: ProjectDto): void {

    this.toggleSelection(project.id);
  }

  /**
   * Clicked next button
   */
  onClickNext(): void {

    // Move to step 2
    this.step2();
  }

  /**
   * Clicked copy button
   */
  onClickCopy(): void {

    // Copy link to clipboard
    this.clipboardService.copy(this.$invitationUrl());

    // Notify
    this.messageService.message({
      type: 'notice',
      text: 'Invitation link copied to clipboard!',
    });

    // Inviting from a project
    if (this.route.snapshot.params['projectId']) {

      this.router.navigate(['/project/' + this.route.snapshot.params['projectId']]);

      return;
    }

    this.router.navigate([this.userConfig.route.home]);
  }

  /**
   * Next projects
   */
  private onNextProjects(projects: ProjectDto[]): void {

    this.$projects.set(projects);
    this.$isLoadingProjects.set(false);
  }

  /**
   * Toggle project ID selection
   */
  private toggleSelection(projectId: string): void {

    // Toggle selection
    const selectedProjectIds = this.$selectedProject();
    selectedProjectIds[projectId] = !selectedProjectIds[projectId];
    this.$selectedProject.set(selectedProjectIds);

    // Update has selection state
    this.$hasSelection.set(Object.keys(selectedProjectIds).some(id => selectedProjectIds[id]));
  }

  /**
   * Display step 1
   */
  private step1(): void {

    // Update step
    this.$step.set(1);

    // Inviting from a project
    if (this.route.snapshot.params['projectId']) {

      // Set project ID
      this.$projectId.set(this.route.snapshot.params['projectId']);

      // Select the project
      this.toggleSelection(this.$projectId());

      // Move to step 2 if selection is valid
      if (this.$hasSelection()) {

        // Move to step 2
        this.step2();
      }

      return;
    }
  }

  /**
   * Display step 2
   */
  private step2(): void {

    // Update step
    this.$step.set(2);

    // No project selected
    if (!this.$hasSelection()) {

      return;
    }

    // Store new invitation
    this
    .invitationService
    .write({
      id: '',
      expireTimestamp: Date.now() + this.invitationConfig.ttl * 3600 * 1000,
      fromUserId: this.authenticationService.userSnapshot.id,
      forProjectIds: Object.keys(this.$selectedProject()).filter(projectId => this.$selectedProject()[projectId]),
    })
    .then(invitation => {

      // Generate invitation URL
      this.$invitationUrl.set([
        window.location.protocol,
        '//',
        window.location.host,
        this.router.createUrlTree(['/invitation', invitation.id, this.authenticationService.userSnapshot.id]).toString(),
      ].join(''));
    });
  }
}
