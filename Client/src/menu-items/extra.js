// assets

import { IconBug, IconPlugConnectedX, IconLock, IconCalendar, IconMap2 } from '@tabler/icons-react';

// constant
const icons = { IconBug, IconPlugConnectedX, IconLock, IconCalendar, IconMap2 };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const extra = {
  id: 'extra',
  title: 'Extra',
  type: 'group',
  children: [
    {
      id: 'ext-calendar',
      title: 'Calendar',
      type: 'item',
      url: '/calendar',
      icon: icons.IconCalendar,
      breadcrumbs: false
    },
    {
      id: 'ext-map',
      title: 'Map',
      type: 'item',
      url: '/extra/map',
      icon: icons.IconMap2,
      breadcrumbs: false
    },
    {
      id: 'ext-contact',
      title: 'Contact Us',
      type: 'item',
      url: '/extra/contact',
      icon: icons.IconPlugConnectedX,
      breadcrumbs: false
    },
    {
      id: 'ext-faq',
      title: 'Faq',
      type: 'item',
      url: '/faq',
      icon: icons.IconBug,
      breadcrumbs: false
    },
    {
      id: 'ext-privacy',
      title: 'Privacy-Policy',
      type: 'item',
      url: '/privacypolicy',
      icon: icons.IconLock,
      breadcrumbs: false
    }
  ]
};

export default extra;
