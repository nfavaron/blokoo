export interface BlockerDto {
  id: string;
  projectId: string;
  createTimestamp: number;
  createUserId: string;
  waitingFor: string;
  to: string;
}
