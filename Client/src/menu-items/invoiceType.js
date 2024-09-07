// assets
import { IconReceipt2,IconFileCertificate } from '@tabler/icons-react'; // New icon imported

// constant
const icons = { IconReceipt2,IconFileCertificate}; // Add the new icon to the icons object

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const invoiceType = {
  id: 'invoiceType',
  title: 'Invoice Type',
  caption: 'Select invoice format',
  type: 'group',
  children: [
    {
      id: 'invoice',
      title: 'Invoice',
      type: 'item',
      url: '/invoice',
      target: false, // Ensure the link opens in the same tab
      icon: icons.IconReceipt2,
    },
    {
      id: 'proformaInvoice',
      title: 'Proforma Invoice',
      type: 'item',
      url: '/proformainvoice',
      target: false, // Ensure the link opens in the same tab
      icon: icons.IconFileCertificate,
    }
  ]
};

export default invoiceType;
