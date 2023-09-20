import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HeaderInterface } from '../interface/header.interface';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  /**
   * Observable
   */
  private header$: Observable<HeaderInterface>;
  private headerSubject: Subject<HeaderInterface>;

  /**
   * Constructor
   */
  constructor() {

    this.headerSubject = new Subject<HeaderInterface>();
    this.header$ = this.headerSubject.asObservable();
  }

  /**
   * Return an observable of the current header.
   * Optional header update.
   */
  header(header?: HeaderInterface): Observable<HeaderInterface> {

    if (header) {

      setTimeout(() => this.headerSubject.next(header));
    }

    return this.header$;
  }
}
