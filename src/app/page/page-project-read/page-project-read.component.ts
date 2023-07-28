import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlockerDto } from '../../dto/blocker.dto';
import { ProjectDto } from '../../dto/project.dto';
import { ProjectService } from '../../service/project.service';
import { MessageService } from '../../service/message.service';
import { AuthenticationService } from '../../service/authentication.service';
import { BlockerService } from '../../service/blocker.service';
import { CommonModule } from '@angular/common';
import { UserConfig } from '../../config/user.config';
import { MemberService } from '../../service/member.service';
import { MemberDto } from '../../dto/member.dto';
import { ProjectAclEnum } from '../../enum/project-acl.enum';
import { CardMemberComponent } from '../../component/card-member/card-member.component';
import { CardBlockerComponent } from '../../component/card-blocker/card-blocker.component';

@Component({
  selector: 'app-page-project-read',
  templateUrl: './page-project-read.component.html',
  styleUrls: ['./page-project-read.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    CardBlockerComponent,
    CardMemberComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageProjectReadComponent implements OnInit, OnDestroy {

  /**
   * State
   */
  $isLoadingProject: WritableSignal<boolean> = signal(true);
  $isLoadingBlockers: WritableSignal<boolean> = signal(true);
  $isLoadingMembers: WritableSignal<boolean> = signal(true);
  $project: WritableSignal<ProjectDto> = signal({
    id: '',
    createTimestamp: 0,
    createUserId: '',
    name: '',
    color: '',
    waitingFor: '',
    to: '',
    sinceTimestamp: 0,
  });
  $blockers: WritableSignal<BlockerDto[]> = signal([]);
  $members: WritableSignal<MemberDto[]> = signal([]);

  /**
   * Dependencies
   */
  private authenticationService = inject(AuthenticationService);
  private projectService = inject(ProjectService);
  private blockerService = inject(BlockerService);
  private memberService = inject(MemberService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userConfig = inject(UserConfig);

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    // Project subscription
    this.subscriptions.push(
      this.projectService.read({ ids: [this.route.snapshot.params['projectId']], aclMin: ProjectAclEnum.member }).subscribe(projects => this.onNextProjects(projects)),
    );

    // Blockers subscription
    this.subscriptions.push(
      this.blockerService.read({ projectId: this.route.snapshot.params['projectId'] }).subscribe(blockers => this.onNextBlockers(blockers)),
    );

    // Members subscription
    this.subscriptions.push(
      this.memberService.read({ projectId: this.route.snapshot.params['projectId'] }).subscribe(members => this.onNextMembers(members)),
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
   * Received next projects
   */
  onNextProjects(projects: ProjectDto[]): void {

    // Project not found
    if (!projects[0]) {

      // Redirect to home
      this.router.navigate([this.userConfig.route.home]);

      return;
    }

    this.$project.set(projects[0]);
    this.$isLoadingProject.set(false);
  }

  /**
   * Received next blockers
   */
  onNextBlockers(blockers: BlockerDto[]): void {

    this.$blockers.set(blockers);
    this.$isLoadingBlockers.set(false);
  }

  /**
   * Received next members
   */
  onNextMembers(members: MemberDto[]): void {

    this.$members.set(members);
    this.$isLoadingMembers.set(false);
  }

  // TODO[nico] implement page/form/sidebar/whatever
  onClickAddBlocker(): void {

    const firstname = ['Nicolas', 'Damien', 'Marc', 'Thomas', 'Alexis'];

    this
      .projectService
      .addBlocker(this.$project(), {
        id: '',
        projectId: this.$project().id,
        createUserId: this.authenticationService.userSnapshot.id,
        waitingFor: firstname[Math.floor(Math.random() * 0.99 * firstname.length)],
        to: 'do something',
        createTimestamp: Date.now(),
      })
      .then(blocker => this.messageService.notify('success', 'Blocker added!'));
  }
}
