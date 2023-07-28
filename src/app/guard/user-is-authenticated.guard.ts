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
export class UserIsAuthenticatedGuard {

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

          // User is not authenticated
          if (!user.id) {

            // Redirect to homepage with requested route as redirect query param
            return this.router.createUrlTree([this.userConfig.route.authentication], {
              queryParams: {
                redirect: state.url,
              },
            });
          }

          return true;
        }),
      );
  }
}
