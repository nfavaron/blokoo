import { Injectable } from '@angular/core';
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  Auth, signInWithPopup, sendSignInLinkToEmail
} from '@angular/fire/auth';
import { UserCredential } from '@firebase/auth';

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
  authProviderMapping: { [providerName: string]: (auth: Auth, email: string) => Promise<UserCredential|void> } = {
    google: (auth: Auth, email: string) => signInWithPopup(auth, new GoogleAuthProvider()),
    github: (auth: Auth, email: string) => signInWithPopup(auth, new GithubAuthProvider()),
    facebook: (auth: Auth, email: string) => signInWithPopup(auth, new FacebookAuthProvider()),
    email: (auth: Auth, email: string) => sendSignInLinkToEmail(auth,  email, { handleCodeInApp: true, url: window.location.href }),
  };
}
