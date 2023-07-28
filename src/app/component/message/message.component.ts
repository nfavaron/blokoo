import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { MessageDto } from '../../dto/message.dto';
import { MessageService } from '../../service/message.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements OnInit, OnDestroy {

  /**
   * State
   */
  message: WritableSignal<MessageDto> = signal({
    type: 'success',
    text: '',
  });

  /**
   * Dependencies
   */
  private messageService = inject(MessageService);

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    this.subscriptions.push(this.messageService.select().subscribe(message => this.message.set(message)));
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
