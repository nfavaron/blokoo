import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, UrlTree
} from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../service/authentication.service';
import { inject, Injectable } from '@angular/core';
import { UserConfig } from '../config/user.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserIsAnonymousGuard {

  /**
   * Dependencies
   */
  private userAuthenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private userConfig = inject(UserConfig);

  /**
   * Route guard method
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {

    return this.userAuthenticationService
      .user$
      .pipe(
        map(user => {

          // User is authenticated
          if (user.id) {

            // Has redirect
            if (route.queryParams['redirect']) {

              return this.router.parseUrl(route.queryParams['redirect']);
            }

            // Redirect to projects list
            return this.router.createUrlTree([this.userConfig.route.home]);
          }

          return !user.id;
        }),
      );
  }
}
