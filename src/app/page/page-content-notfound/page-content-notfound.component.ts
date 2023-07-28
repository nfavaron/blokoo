import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-content-notfound',
  templateUrl: './page-content-notfound.component.html',
  styleUrls: ['./page-content-notfound.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContentNotfoundComponent {

}
