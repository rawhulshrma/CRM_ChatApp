// assets
import { IconUserBolt, IconBuildingFactory, IconUsers } from '@tabler/icons-react'; // New icon imported

// constant
const icons = { IconUserBolt, IconBuildingFactory, IconUsers }; // Add the new icon to the icons object

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const application = {
  id: 'application',
  title: 'Application',
  caption: 'Hello World',
  type: 'group',
  children: [
    {
      id: 'people',
      title: 'People',
      type: 'item',
      url: '/people',
      target: false, // Ensure the link opens in the same tab
      icon: icons.IconUserBolt,
    },
    {
      id: 'companies',
      title: 'Companies',
      type: 'item',
      url: '/companies',
      target: false, // Ensure the link opens in the same tab
      icon: icons.IconBuildingFactory,
    },
    {
      id: 'customers',
      title: 'Customers',
      type: 'item',
      url: '/customers',
      target: false, // Ensure the link opens in the same tab
      icon: icons.IconUsers, // Icon for Customers
    }
  ]
};

export default application;
