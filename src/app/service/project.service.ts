import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { ProjectDto } from '../dto/project.dto';
import { addDoc, collection, collectionData, doc, Firestore, query, setDoc, where } from '@angular/fire/firestore';
import { ProjectAclEnum } from '../enum/project-acl.enum';
import { AuthenticationService } from './authentication.service';
import { AclDto } from '../dto/acl.dto';
import { orderBy } from '@firebase/firestore';
import { ProjectFilterInterface } from '../interface/project-filter.interface';
import { MemberService } from './member.service';
import { BlockerService } from './blocker.service';
import { BlockerDto } from '../dto/blocker.dto';
import { MemberDto } from '../dto/member.dto';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  /**
   * Dependencies
   */
  private authenticationService = inject(AuthenticationService);
  private firestore = inject(Firestore);
  private memberService = inject(MemberService);
  private blockerService = inject(BlockerService);

  /**
   * Read projects filtered by @filters and sorted by "since date" DESC
   */
  read(filters: ProjectFilterInterface): Observable<ProjectDto[]> {

    return this
    .selectAclProjects()
    .pipe(
      switchMap(projectAcls => {

        // User is at least "invited" to project
        let ids = projectAcls
        .filter(projectAcl => projectAcl.acl >= ProjectAclEnum.invited)
        .map(projectAcl => projectAcl.projectId);

        // Filters: IDs
        if (filters?.ids) {

          ids = filters.ids.filter(id => ids.includes(id));
        }

        // Must have IDs filter
        if (ids.length === 0) {

          return of([]);
        }

        return collectionData(
          query(
            collection(this.firestore, 'projects'),
            where('id', 'in', ids),
            orderBy('sinceTimestamp', 'desc'),
          )
        ) as Observable<ProjectDto[]>;
      }),
    );
  }

  /**
   * Write project
   */
  async write(project: ProjectDto): Promise<ProjectDto> {

    let promise: Promise<ProjectDto> = Promise.resolve(project);

    // Add
    if (!project.id) {

      promise = addDoc(collection(this.firestore, 'projects'), project)
      .then(documentReference => {

        // Update DTO with generated ID
        project.id = documentReference.id;

        // Set user project ACL
        return this.setAclProject(
          project.createUserId,
          {
            projectId: project.id,
            acl: ProjectAclEnum.owner,
            invitationId: '',
          },
        );
      })

      // Add authenticated user as member type 'owner'
      .then(() => this.memberService.write({
        projectId: project.id,
        userId: project.createUserId,
        acl: ProjectAclEnum.owner,
        createTimestamp: project.createTimestamp,
      }))

      // TODO[nico] remove automatic creation of first blocker
      .then(() => this.blockerService.write({
        id: '',
        projectId: project.id,
        createUserId: project.createUserId,
        waitingFor: project.waitingFor,
        to: project.to,
        createTimestamp: project.createTimestamp,
      }))

      .then(() => Promise.resolve(project));
    }

    // Upsert
    return promise
      .then(() => setDoc(doc(this.firestore, 'projects', project.id), project))
      .then(() => Promise.resolve(project));
  }

  /**
   * Return user's ACL per project
   */
  selectAclProjects(): Observable<AclDto[]> {

    // User not auth
    if (!this.authenticationService.userSnapshot.id) {

      return of([]);
    }

    return (collectionData(collection(this.firestore, 'acl', this.authenticationService.userSnapshot.id, 'projects')) as Observable<AclDto[]>);
  }

  /**
   * Add @blocker to the @project
   */
  async addBlocker(project: ProjectDto, blocker: BlockerDto): Promise<BlockerDto> {

    return this.blockerService.write(blocker)
      .then(blocker => this.write({
        ...project,
        waitingFor: blocker.waitingFor,
        to: blocker.to,
        sinceTimestamp: blocker.createTimestamp,
      }))
      .then(project => Promise.resolve(blocker));
  }

  /**
   * Add @member to the @project
   */
  async addMember(project: ProjectDto, member: MemberDto): Promise<MemberDto> {

    return this.memberService.write(member);
  }

  /**
   * Insert or update user's ACL per project
   */
  async setAclProject(userId: string, aclProject: AclDto): Promise<void> {

    return setDoc(doc(this.firestore, 'acl', userId, 'projects', aclProject.projectId), aclProject);
  }

  /**
   * Insert or update user's ACL to user per project
   */
  async setAclUser(userId: string, targetUserId: string, projectId: string): Promise<void> {

    return setDoc(doc(this.firestore, 'acl', userId, 'users', targetUserId), { projectId });
  }
}
