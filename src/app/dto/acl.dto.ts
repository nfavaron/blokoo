import { ProjectAclEnum } from '../enum/project-acl.enum';

export interface AclDto {
  projectId: string;
  acl: ProjectAclEnum;
  invitationId: string;
}
