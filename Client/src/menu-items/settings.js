// assets
import { IconSettings,IconUserPlus,IconBrandUbuntu,IconCoinRupeeFilled,IconTex,IconUserCode,IconMan } from '@tabler/icons-react';

// constant
const icons = {
    IconSettings,IconUserPlus,IconBrandUbuntu,IconCoinRupeeFilled,IconTex,IconUserCode,IconMan
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const settings = {
    id: 'settings',
    title: 'Settings',
    caption: 'Changes',
    type: 'group',
    children : [
      {
        id: 'settings',
        title: 'Settings',
        type: 'collapse',
        icon: icons.IconSettings,
        children: [
          {
            id: 'about',
            title: 'About',
            type: 'item',
            url: '/about',
            icon: icons.IconBrandUbuntu,
            target: false
          },
          {
            id: 'admin',
            title: 'Admin',
            type: 'item',
            url: '/admin',
            icon: icons.IconUserPlus,
            target: false
          },
         
          {
            id: 'currencies',
            title: 'Currencies',
            type: 'item',
            url: '/settings/currencies',
            icon: icons.IconCoinRupeeFilled,
            target: false
          },
          {
            id: 'employee',
            title: 'Employee',
            type: 'item',
            url: '/employee',
            icon: icons.IconMan,
            target: false
          },
          {
            id: 'manager',
            title: 'Manager',
            type: 'item',
            url: '/manager',
            icon: icons.IconUserCode,
            target: false
          },
          {
            id: 'settings',
            title: 'Settings',
            type: 'item',
            url: '/settings/setting',
            icon: icons.IconSettings,
            target: false
          },
          {
            id: 'taxes',
            title: 'Taxes',
            type: 'item',
            url: '/settings/tax',
            icon: icons.IconTex,
            target: false
          }
        ]
      }
    ]
    
  };
  
  export default settings;
  