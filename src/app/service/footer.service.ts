import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FooterInterface } from '../interface/footer.interface';
import { ActionEnum } from '../enum/action.enum';
import { TabEnum } from '../enum/tab.enum';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  /**
   * Observables
   */
  private footer$: Observable<FooterInterface>;
  private footerSubject: Subject<FooterInterface>;
  private action$: Observable<ActionEnum>;
  private actionSubject: Subject<ActionEnum>;
  private tab$: Observable<TabEnum>;
  private tabSubject: Subject<TabEnum>;

  /**
   * Constructor
   */
  constructor() {

    this.footerSubject = new Subject<FooterInterface>();
    this.footer$ = this.footerSubject.asObservable();
    this.actionSubject = new Subject<ActionEnum>();
    this.action$ = this.actionSubject.asObservable();
    this.tabSubject = new Subject<TabEnum>();
    this.tab$ = this.tabSubject.asObservable();
  }

  /**
   * Return an observable of the current footer.
   * Optional footer update.
   */
  footer(footer?: FooterInterface): Observable<FooterInterface> {

    if (footer) {

      setTimeout(() => this.footerSubject.next(footer));
    }

    return this.footer$;
  }

  /**
   * Return an observable of the current action.
   * Optional action update.
   */
  action(action?: ActionEnum): Observable<ActionEnum> {

    if (action) {

      setTimeout(() => this.actionSubject.next(action));
    }

    return this.action$;
  }

  /**
   * Return an observable of the current tab.
   * Optional tab update.
   */
  tab(tab?: TabEnum): Observable<TabEnum> {

    if (tab) {

      setTimeout(() => this.tabSubject.next(tab));
    }

    return this.tab$;
  }
}
