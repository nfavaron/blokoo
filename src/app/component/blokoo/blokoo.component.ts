import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-blokoo',
  templateUrl: './blokoo.component.html',
  styleUrls: ['./blokoo.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlokooComponent {

  /**
   * State
   */
  @Input() size: string = 'default';

}
