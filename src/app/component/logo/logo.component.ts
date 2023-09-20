import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {

  /**
   * State
   */
  @Input() size: string = 'default';

}
