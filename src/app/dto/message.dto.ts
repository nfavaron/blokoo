import { MessageType } from '../type/message.type';

export interface MessageDto {
  type: MessageType;
  text: string;
}
