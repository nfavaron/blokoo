import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractComponent } from '../abstract.component';
import { FooterService } from '../../service/footer.service';
import { FooterInterface } from '../../interface/footer.interface';
import { BlokooComponent } from '../blokoo/blokoo.component';
import { IconComponent } from '../icon/icon.component';
import { LogoComponent } from '../logo/logo.component';
import { RouterModule } from '@angular/router';
import { ActionEnum } from '../../enum/action.enum';
import { TabEnum } from '../../enum/tab.enum';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BlokooComponent,
    IconComponent,
    LogoComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent extends AbstractComponent implements OnInit {

  /**
   * State (public)
   */
  $footer: WritableSignal<FooterInterface> = signal({
    title: '',
    tabs: [],
    actions:  [],
  });
  $tab: WritableSignal<TabEnum|null> = signal(null);
  $isOpenMenuActions: WritableSignal<boolean> = signal(false);

  /**
   * Dependencies
   */
  private footerService = inject(FooterService);

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    // Footer
    this.subscribe(
      this.footerService.footer(),
      (footer) => this.onNextFooter(footer),
    );

    // Tab
    this.subscribe(
      this.footerService.tab(),
      (tab) => this.onNextTab(tab),
    );
  }

  /**
   * Clicked document
   */
  @HostListener('document:click', [])
  onClickDocument() {

    this.$isOpenMenuActions.set(false);
  }

  /**
   * Clicked page action button
   */
  onClickPageActionButton(): void {

    if (this.$isOpenMenuActions() === true) {

      // HostListener already takes care of closing
      return;
    }

    setTimeout(() => this.$isOpenMenuActions.set(true));
  }

  /**
   * Clicked an action
   */
  onClickAction(action: ActionEnum): void {

    this.footerService.action(action);
  }

  /**
   * Clicked a tab
   */
  onClickTab(tab: TabEnum): void {

    this.footerService.tab(tab);
  }

  /**
   * Next footer
   */
  private onNextFooter(footer: FooterInterface): void {

    // Set new footer
    this.$footer.set(footer);
  }

  /**
   * Next tab
   */
  private onNextTab(tab: TabEnum): void {

    // Set new tab
    this.$tab.set(tab);
  }
}
