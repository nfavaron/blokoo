import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { UserDto } from '../dto/user.dto';
import {
  Auth,
  signInWithPopup,
  signOut,
  authState
} from '@angular/fire/auth';
import { UserConfig } from '../config/user.config';
import { UserService } from './user.service';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  /**
   * User observable
   */
  user$: Observable<UserDto>;

  /**
   * User snapshot
   */
  userSnapshot: UserDto = {
    id: '',
    name: '',
    email: '',
    photoUrl: '',
  };

  /**
   * Dependencies
   */
  private auth: Auth = inject(Auth);
  private userConfig = inject(UserConfig);
  private userService = inject(UserService);

  /**
   * Constructor
   */
  constructor() {

    // User observable
    this.user$ = authState(this.auth)
      .pipe(
        switchMap(user => {

          // Keep user snapshot
          this.userSnapshot = {
            id: user?.uid || '',
            name: user?.displayName || '',
            email: user?.email || '',
            photoUrl: user?.photoURL || '',
          };

          // Update user in database
          return user && user.uid ? fromPromise(this.userService.write(this.userSnapshot)) : of(this.userSnapshot);
        }),
        map(user => this.userSnapshot),
      );
  }

  /**
   * Sign in user
   */
  async signIn(providerName: string): Promise<void> {

    // Unsupported provider
    if (!this.userConfig.authProviderMapping[providerName]) {

      return Promise.reject('Invalid signIn provider name');
    }

    // Sign in
    await signInWithPopup(this.auth, this.userConfig.authProviderMapping[providerName]());

    return Promise.resolve();
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {

    // Sign out
    return signOut(this.auth);
  }
}