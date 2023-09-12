import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../component/logo/logo.component';
import { BlokooComponent } from '../../component/blokoo/blokoo.component';

@Component({
  selector: 'app-page-content-home',
  templateUrl: './page-content-home.component.html',
  styleUrls: ['./page-content-home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LogoComponent,
    BlokooComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContentHomeComponent {

}
