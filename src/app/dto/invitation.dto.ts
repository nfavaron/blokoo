export interface InvitationDto {
  id: string;
  expireTimestamp: number;
  fromUserId: string;
  forProjectIds: string[];
}
