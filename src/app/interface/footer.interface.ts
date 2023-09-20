import { ActionEnum } from '../enum/action.enum';
import { TabEnum } from '../enum/tab.enum';

export interface FooterInterface {
  tabs: Array<{
    uid: TabEnum;
    label: string;
  }>;
  actions: Array<{
    uid: ActionEnum;
    label: string;
    icon: string;
  }>
}
