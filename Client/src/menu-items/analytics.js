// assets
// import { FaUserAstronaut, FaUsers, FaIdCard, FaInfoCircle, FaCog } from "react-icons/fa";
import {IconReportSearch } from '@tabler/icons-react';



// constant
const icons = {IconReportSearch };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const analytics = {
  id: 'analytics',
  title: 'Analytics',
  type: 'group',
  children: [
    {
      id: 'analytics',
      title: 'Analytics',
      type: 'item',
      url: '/analytics/',
      icon: icons.IconReportSearch,
      breadcrumbs: false
    }
  ]
};

export default analytics;
