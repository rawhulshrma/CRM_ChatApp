// assets
import { IconBrandWhatsapp } from '@tabler/icons-react';

// constant
const icons = { IconBrandWhatsapp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const chat = {
  id: 'chat',
  type: 'group',
  children: [
    {
      id: 'chat',
      title: 'Chat',
      type: 'item',
      url: '/chat',
      icon: icons.IconBrandWhatsapp,
      breadcrumbs: false
    },
  ]
};

export default chat;
