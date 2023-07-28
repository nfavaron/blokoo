export interface ProjectDto {
  id: string;
  createTimestamp: number;
  createUserId: string;
  name: string;
  color: string;
  waitingFor: string;
  to: string;
  sinceTimestamp: number;
}
