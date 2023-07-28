import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InvitationConfig {

  /**
   * Invitation TTL in hours
   */
  ttl: number = 24;

}
