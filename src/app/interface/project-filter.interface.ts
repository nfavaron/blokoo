import { ProjectAclEnum } from '../enum/project-acl.enum';

export interface ProjectFilterInterface {
    ids?: string[];
    aclMin: ProjectAclEnum;
}
