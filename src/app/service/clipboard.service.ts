import { inject, Injectable } from '@angular/core';
import { ClipboardService as NgxClipboardService } from 'ngx-clipboard';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {

  /**
   * Dependencies
   */
  private ngxClipboardService = inject(NgxClipboardService);

  /**
   * Copy text to clipboard
   */
  copy(text: string): void {

    this.ngxClipboardService.copy(text);
  }
}
