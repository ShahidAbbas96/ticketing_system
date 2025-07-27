// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './demo/Guard/AuthGuard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'departments',
        loadComponent: () => import('./demo/departments/departments.component').then((m)=>m.DepartmentsComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        loadComponent: () => import('./demo/users/users.component').then((m)=>m.UsersComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'tickets',
        loadComponent: () => import('./demo/tickets/tickets.component').then((m)=>m.TicketsComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'ticket-listing',
        loadComponent: () => import('./demo/tickets/ticket-listing/ticket-listing.component').then((m)=>m.TicketListingComponent),
        canActivate: [AuthGuard]
      }
    
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
    /*{
        path: 'auth/signup',
      loadComponent: () => import('./demo/authentication/sign-up/sign-up.component')
      },*/
      {
        path: 'auth/signin',
        loadComponent: () => import('./demo/authentication/sign-in/sign-in.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
