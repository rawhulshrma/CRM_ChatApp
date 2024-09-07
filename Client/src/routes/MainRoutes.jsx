import { Navigate } from 'react-router-dom';
import { lazy } from 'react';
import PrivateRoute from './PrivateRoute';
import MainLayout from 'layout/MainLayout';
import ErrorBoundary from '../ErrorBoundary';
import Loadex from '../ui-component/Loadex';
import Loadable from '../ui-component/Loadable';

// Existing views
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')), {
  fallback: <Loadex />
});
const Invoice = Loadable(lazy(() => import('views/invoice/invoice')), {
  fallback: <Loadex />
});
const CreateInvoice = Loadable(lazy(() => import('views/invoice/invoice/createInvoice')), {
  fallback: <Loadex />
});
const ProformaInvoice = Loadable(lazy(() => import('views/invoice/proformaInvoice/index.jsx')), {
  fallback: <Loadex />
});
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')), {
  fallback: <Loadex />
});
const Chat = Loadable(lazy(() => import('views/chat')), {
  fallback: <Loadex />
});
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')), {
  fallback: <Loadex />
});
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')), {
  fallback: <Loadex />
});
const ProductsCategory = Loadable(lazy(() => import('views/products/ProductCategory')), {
  fallback: <Loadex />
});
const Admin = Loadable(lazy(() => import('views/admin')), {
  fallback: <Loadex />
});
const Products = Loadable(lazy(() => import('views/products/Products')), {
  fallback: <Loadex />
});
const Calendar = Loadable(lazy(() => import('views/extra/calendar')), {
  fallback: <Loadex />
});
const Faq = Loadable(lazy(() => import('views/extra/faq')), {
  fallback: <Loadex />
});
const PrivacyPolicy = Loadable(lazy(() => import('views/extra/privacyPolicy')), {
  fallback: <Loadex />
});
const About = Loadable(lazy(() => import('views/about')), {
  fallback: <Loadex />
});
const Analytics = Loadable(lazy(() => import('views/analytics')), {
  fallback: <Loadex />
});
const People = Loadable(lazy(() => import('views/application/people')), {
  fallback: <Loadex />
});
const Companies = Loadable(lazy(() => import('views/application/companies')), {
  fallback: <Loadex />
});
const Customer = Loadable(lazy(() => import('views/application/customer')), {
  fallback: <Loadex />
});
const Profile = Loadable(lazy(() => import('views/profile')), {
  fallback: <Loadex />
});
const Manager = Loadable(lazy(() => import('views/manager')), {
  fallback: <Loadex />
});
const Employee = Loadable(lazy(() => import('views/employee')), {
  fallback: <Loadex />
});
const Currencies = Loadable(lazy(() => import('views/settings/currencies')), {
  fallback: <Loadex />
});
const Tax = Loadable(lazy(() => import('views/settings/tax')), {
  fallback: <Loadex />
});

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <PrivateRoute />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: '/',
          element: <Navigate to="/dashboard" />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/chat',
          element: <Chat />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/about',
          element: <About />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/settings/tax',
          element: <Tax />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/dashboard',
          element: <DashboardDefault />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/utils/util-typography',
          element: <UtilsTypography />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/utils/util-color',
          element: <UtilsColor />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/utils/util-shadow',
          element: <UtilsShadow />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/people',
          element: <People />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/companies',
          element: <Companies />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/analytics',
          element: <Analytics />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/profile',
          element: <Profile />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/admin',
          element: <Admin />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/manager',
          element: <Manager />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/employee',
          element: <Employee />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/products',
          element: <Products />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/calendar',
          element: <Calendar />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/faq',
          element: <Faq />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/privacypolicy',
          element: <PrivacyPolicy />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/category/products',
          element: <ProductsCategory />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/customers',
          element: <Customer />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/settings/currencies',
          element: <Currencies />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/proformainvoice',
          element: <ProformaInvoice />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/invoice',
          element: <Invoice />,
          errorElement: <ErrorBoundary />
        },
        {
          path: '/invoice/create',
          element: <CreateInvoice />,
          errorElement: <ErrorBoundary />
        }
      ]
    }
  ]
};

export default MainRoutes;
