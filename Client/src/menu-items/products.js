// assets
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';

import { IconBrandAppleFilled,IconCategoryPlus } from '@tabler/icons-react'; 

// constant
const icons = { PrecisionManufacturingOutlinedIcon,IconBrandAppleFilled,IconCategoryPlus };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const products = {
  id: 'products',
  title: 'Products',
  caption: 'Products & Category',
  type: 'group',
  children: [
    {
      id: 'products',
      title: 'Products',
      type: 'collapse',
      icon: icons.PrecisionManufacturingOutlinedIcon,
      children: [
        {
          id: 'products',
          title: 'Products',
          type: 'item',
          url: '/products',
          target: false ,
          icon: icons.IconBrandAppleFilled,
        },
        {
          id: 'products-category',
          title: 'Products Category',
          type: 'item',
          url: '/category/products',
          icon: icons.IconCategoryPlus,
          target: false // Ensure the link opens in the same tab
        }
      ]
    }
  ]
};

export default products;
