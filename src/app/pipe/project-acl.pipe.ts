import { Pipe, PipeTransform } from '@angular/core';
import { ProjectAclEnum } from '../enum/project-acl.enum';

@Pipe({
  name: 'projectAcl',
  standalone: true,
})
export class ProjectAclPipe implements PipeTransform {

  /**
   * Project ACL mapping
   */
  private projectAclMapping: { [projectAcl: string]: string } = {};

  /**
   * Constructor
   */
  constructor() {

    this.projectAclMapping[ProjectAclEnum.removed] = 'removed';
    this.projectAclMapping[ProjectAclEnum.refused] = 'refused';
    this.projectAclMapping[ProjectAclEnum.left] = 'left';
    this.projectAclMapping[ProjectAclEnum.invited] = 'invited';
    this.projectAclMapping[ProjectAclEnum.member] = 'member';
    this.projectAclMapping[ProjectAclEnum.manager] = 'manager';
    this.projectAclMapping[ProjectAclEnum.owner] = 'owner';
  }

  /**
   * Transforms a ProjectAclEnum into its label
   */
  transform(projectAcl: ProjectAclEnum): string {

    return this.projectAclMapping[projectAcl] || 'unkown';
  }
}
