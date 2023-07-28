import { ProjectAclEnum } from '../enum/project-acl.enum';

export interface MemberDto {
  userId: string;
  projectId: string;
  createTimestamp: number;
  acl: ProjectAclEnum;
}
