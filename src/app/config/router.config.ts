import { Routes } from '@angular/router';
import { PageAuthenticationComponent } from '../page/page-authentication/page-authentication.component';
import { PageContentHomeComponent } from '../page/page-content-home/page-content-home.component';
import { PageContentNotfoundComponent } from '../page/page-content-notfound/page-content-notfound.component';
import { PageProjectListComponent } from '../page/page-project-list/page-project-list.component';
import { PageProjectReadComponent } from '../page/page-project-read/page-project-read.component';
import { UserIsAuthenticatedGuard } from '../guard/user-is-authenticated.guard';
import { UserIsAnonymousGuard } from '../guard/user-is-anonymous.guard';
import { PageInvitationReadComponent } from '../page/page-invitation-read/page-invitation-read.component';
import { PageInvitationWriteComponent } from '../page/page-invitation-write/page-invitation-write.component';

const routerConfig: Routes = [

  {
    path: 'project',
    children: [

      // Projects
      {
        path: '',
        component: PageProjectListComponent,
        canActivate: [UserIsAuthenticatedGuard],
        pathMatch: 'full',
      },

      // Project
      {
        path: ':projectId',
        children: [
          {
            path: '',
            component: PageProjectReadComponent,
            canActivate: [UserIsAuthenticatedGuard],
            pathMatch: 'full',
          },
        ],
      },
    ],
  },

  // Invitation (all projects)
  {
    path: 'invitation',
    children: [

      // Invitation (all projects)
      {
        path: '',
        component: PageInvitationWriteComponent,
        canActivate: [UserIsAuthenticatedGuard],
        pathMatch: 'full',
      },

      // Invitation (from project)
      {
        path: ':projectId',
        component: PageInvitationWriteComponent,
        canActivate: [UserIsAuthenticatedGuard],
        pathMatch: 'full',
      },

      // Reception
      {
        path: ':invitationId/:fromUserId',
        component: PageInvitationReadComponent,
        canActivate: [UserIsAuthenticatedGuard],
        pathMatch: 'full',
      },
    ],
  },

  // Authentication
  {
    path: 'authentication',
    component: PageAuthenticationComponent,
    canActivate: [UserIsAnonymousGuard],
    pathMatch: 'full',
  },

  // Content - home
  {
    path: '',
    component: PageContentHomeComponent,
    canActivate: [UserIsAnonymousGuard],
  },

  // Content - catchall
  {
    path: '**',
    component: PageContentNotfoundComponent,
  },
];

export default routerConfig;
