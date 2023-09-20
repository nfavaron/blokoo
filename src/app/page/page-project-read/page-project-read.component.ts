import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
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
import { IconComponent } from '../../component/icon/icon.component';
import { ActionEnum } from '../../enum/action.enum';
import { AbstractComponent } from '../../component/abstract.component';
import { HeaderService } from '../../service/header.service';
import { FooterService } from '../../service/footer.service';
import { TabEnum } from '../../enum/tab.enum';

@Component({
  selector: 'app-page-project-read',
  templateUrl: './page-project-read.component.html',
  styleUrls: ['./page-project-read.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    CardBlockerComponent,
    CardMemberComponent,
    IconComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageProjectReadComponent extends AbstractComponent implements OnInit {

  /**
   * Constants
   */
  protected readonly TabEnum = TabEnum;

  /**
   * State (public)
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
  $tab: WritableSignal<TabEnum|null> = signal(null);

  /**
   * State (private)
   */
  private isSubscribedBlockers: boolean = false;
  private isSubscribedMembers: boolean = false;

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
  private headerService = inject(HeaderService);
  private footerService = inject(FooterService);

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    // Update header
    this.headerService.header({
      routerLink: ['/project'],
      title: 'Loading...',
    });

    // Update footer
    this.footerService.footer({
      tabs: [{
        uid: TabEnum.projectBlockers,
        label: 'Blockers',
      }, {
        uid: TabEnum.projectMembers,
        label: 'Members',
      }, {
        uid: TabEnum.projectSettings,
        label: 'Settings',
      }],
      actions: [{
        uid: ActionEnum.blockerNew,
        icon: 'add',
        label: 'Add blocker',
      }, {
        uid: ActionEnum.commentNew,
        icon: 'add',
        label: 'Add comment',
      }, {
        uid: ActionEnum.invitationNew,
        icon: 'invite',
        label: 'Add member',
      }],
    });

    // Action
    this.subscribe(
      this.footerService.action(),
      (action) => this.onNextAction(action),
    );

    // Tab
    this.subscribe(
      this.footerService.tab(TabEnum.projectBlockers),
      (tab) => this.onNextTab(tab),
    );

    // Project
    this.subscribe(
      this.projectService.read({ ids: [this.route.snapshot.params['projectId']], aclMin: ProjectAclEnum.member }),
      (projects) => this.onNextProjects(projects),
    );
  }

  /**
   * Next tab
   */
  private onNextTab(tab: TabEnum): void {

    // Update tab
    this.$tab.set(tab);

    // Blockers
    if (tab === TabEnum.projectBlockers) {

      if (this.isSubscribedBlockers) {

        return;
      }

      this.subscribe(
        this.blockerService.read({ projectId: this.route.snapshot.params['projectId'] }),
        (blockers) => this.onNextBlockers(blockers),
      );

      this.isSubscribedBlockers = true;

      return;
    }

    // Members
    if (tab === TabEnum.projectMembers) {

      if (this.isSubscribedMembers) {

        return;
      }

      this.subscribe(
        this.memberService.read({ projectId: this.route.snapshot.params['projectId'] }),
        (members) => this.onNextMembers(members),
      );

      this.isSubscribedMembers = true;

      return;
    }

    // Settings
    if (tab === TabEnum.projectSettings) {

      // TODO[nico]

      return;
    }
  }

  /**
   * Next action
   */
  private onNextAction(action: ActionEnum): void {

    if (action === ActionEnum.blockerNew) {

      // TODO[nico] implement page/form/sidebar/whatever
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
      .then(blocker => this.messageService.message({
        type: 'success',
        text: 'Blocker added!',
      }));

      return;
    }

    if (action === ActionEnum.invitationNew) {

      this.router.navigate(['/invitation', this.$project().id]);
    }
  }

  /**
   * Next projects
   */
  private onNextProjects(projects: ProjectDto[]): void {

    // Project not found
    if (!projects[0]) {

      // Redirect to home
      this.router.navigate([this.userConfig.route.home]);

      return;
    }

    this.$project.set(projects[0]);
    this.$isLoadingProject.set(false);

    // Update header
    this.headerService.header({
      routerLink: ['/project'],
      title: this.$project().name,
    });
  }

  /**
   * Next blockers
   */
  private onNextBlockers(blockers: BlockerDto[]): void {

    this.$blockers.set(blockers);
    this.$isLoadingBlockers.set(false);
  }

  /**
   * Next members
   */
  private onNextMembers(members: MemberDto[]): void {

    this.$members.set(members);
    this.$isLoadingMembers.set(false);
  }
}
