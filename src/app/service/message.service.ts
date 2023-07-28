import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MessageDto } from '../dto/message.dto';
import { MessageType } from '../type/message.type';

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
   * Return an observable of the current message
   */
  select(): Observable<MessageDto> {

    return this.message$;
  }

  /**
   * Notify message
   */
  notify(type: MessageType, text: string): void {

    this.messageSubject.next({
      type,
      text,
    });
  }
}
