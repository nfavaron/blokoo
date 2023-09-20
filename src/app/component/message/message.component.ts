import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MessageDto } from '../../dto/message.dto';
import { MessageService } from '../../service/message.service';
import { CommonModule } from '@angular/common';
import { AbstractComponent } from '../abstract.component';

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
export class MessageComponent extends AbstractComponent implements OnInit {

  /**
   * Configuration
   */
  duration: number = 3000; // Animation duration in ms

  /**
   * State (public)
   */
  $message: WritableSignal<MessageDto> = signal({
    type: 'success',
    text: '',
  });

  /**
   * State (private)
   */
  private durationTimeout: number = 0;

  /**
   * Dependencies
   */
  private messageService = inject(MessageService);

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    // Subscribe to observables
    this.subscribe(
      this.messageService.message(),
      (message) => this.onNextMessage(message),
    );
  }

  /**
   * Clicked the message
   */
  onClickMessage(): void {

    // Reset message
    this.reset();
  }

  /**
   * Next message
   */
  private onNextMessage(message: MessageDto): void {

    // Set new message
    this.$message.set(message);

    // Reset message after this.duration ms
    setTimeout(() => this.reset(), this.duration);
  }

  /**
   * Reset message
   */
  private reset(): void {

    // Has a duration timeout
    if (this.durationTimeout) {

      clearTimeout(this.durationTimeout);
    }

    // Set default message
    this.$message.set({
      type: 'success',
      text: '',
    });
  }
}
