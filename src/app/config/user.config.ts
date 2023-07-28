import { Injectable } from '@angular/core';
import { AuthProvider, FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserConfig {

  /**
   * Routes used in the project based on user authentication state
   */
  route = {
    authentication: '/authentication',
    home: '/project',
  };

  /**
   * Supported authentication providers
   */
  authProviderMapping: { [providerName: string]: () => AuthProvider } = {
    google: () => new GoogleAuthProvider(),
    github: () => new GithubAuthProvider(),
    facebook: () => new FacebookAuthProvider(),
  };
}
