import { createBrowserRouter } from 'react-router';
import RootLayout from '../Layouts/RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    Component:RootLayout
  },
  {
    path: '/about',
    element: <h1>About</h1>,
  },
]);

export default router;
