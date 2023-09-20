import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MessageDto } from '../dto/message.dto';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  /**
   * Observable
   */
  private message$: Observable<MessageDto>;
  private messageSubject: Subject<MessageDto>;

  /**
   * Constructor
   */
  constructor() {

    this.messageSubject = new Subject<MessageDto>();
    this.message$ = this.messageSubject.asObservable();
  }

  /**
   * Return an observable of the current message.
   * Optional message update.
   */
  message(message?: MessageDto): Observable<MessageDto> {

    if (message) {

      this.messageSubject.next(message);
    }

    return this.message$;
  }
}
