export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
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
        icon: 'feather icon-home'
      },
      {
        id: 'departments',
        title: 'Departments',
        type: 'item',
        url: '/departments',
        icon: 'feather icon-department'
      },
      {
        id: 'user',
        title: 'Users',
        type: 'item',
        url: '/users',
        icon: 'icon-users'
      },
      {
        id: 'ticket',
        title: 'Tickets',
        type: 'item',
        url: '/tickets',
        icon: 'icon-ticket'
      }
    ]
  }
    
  
];
