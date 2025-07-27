import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';  // Adjust the path as needed
import { NavigationItem } from '../theme/layout/admin/navigation/navigation';


@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  navigationItems: NavigationItem[] = [];
  userId: string | null = null;
  roleId: string | null = null;
  constructor(authService:AuthService) {
    this.userId = authService.getDecodedToken()?.userId||'';
    this.roleId = authService.getDecodedToken()?.role||'';
    debugger;
    const isAdmin = this.roleId === '2';

    // Define navigation items based on user role
    this.navigationItems = [
      {
        id: 'navigation',
        title: 'Navigation',
        type: 'group',
        icon: 'icon-group',
        children: [
          {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/analytics',
            icon: 'feather icon-home',
            hidden:false
          },
          {
            id: 'departments',
            title: 'Departments',
            type: 'item',
            url: '/departments',
            icon: 'feather icon-department',
            hidden: !isAdmin // Show this item only for admin users
          },
          {
            id: 'user',
            title: 'Users',
            type: 'item',
            url: '/users',
            icon: 'icon-users',
            hidden: !isAdmin  // Show this item only for admin users
          },
          {
            id: 'ticket',
            title: 'Tickets',
            type: 'item',
            url: '/tickets',
            icon: 'icon-ticket',
            hidden:false
          },
          {
            id: 'ticket-listing',
            title: 'Ticket Listing',
            type: 'item',
            url: '/ticket-listing',
            icon: 'icon-list',
            hidden:false
          }
        ]
      }
    ];
  }

    
  
  getNavigationItems(): NavigationItem[] {
    return this.navigationItems;
  }
}
