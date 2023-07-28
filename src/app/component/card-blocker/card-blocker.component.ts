import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { BlockerDto } from '../../dto/blocker.dto';
import { CommonModule } from '@angular/common';
import { CardUserComponent } from '../card-user/card-user.component';

@Component({
  selector: 'app-card-blocker',
  templateUrl: './card-blocker.component.html',
  styleUrls: ['./card-blocker.component.scss'],
  imports: [
    CommonModule,
    CardUserComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardBlockerComponent {

  /**
   * State
   */
  @Input() blocker!: BlockerDto;

}
