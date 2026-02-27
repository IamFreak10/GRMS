import { createBrowserRouter } from 'react-router';
import RootLayout from '../Layouts/RootLayout';
import Home from '../Pages/Home/Home';
import AuthLayout from '../Layouts/AuthLayout';
import { Component } from 'react';
import Register from '../Pages/Auth/Register';
import Login from '../Pages/Auth/Login';
import DashBoardLayout from '../Layouts/DashBoardLayout';
import UserRoutes from '../Routes/UserRoutes';
import AdminRoutes from '../Routes/AdminRoutes';
import ManageRoom from '../Pages/Dashboard/Admin/ManageRoom';
import BookRoom from '../Pages/Dashboard/User/BookRoom';
import Checkout from '../Pages/Dashboard/User/Checkout';
import Payment from '../Pages/Dashboard/User/Payment';


const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'register',
        Component: Register,
      },
      {
        path: 'login',
        Component: Login,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <UserRoutes>
        <DashBoardLayout />
      </UserRoutes>
    ),
    children: [
      {
        path: 'manage-rooms',
        element: (
          <AdminRoutes>
            <ManageRoom />
          </AdminRoutes>
        ),
      },
      {
        path: 'book-room',
        Component: BookRoom,
      },
      {
        path: 'checkout',
        //?From Jubayer PC
        Component: Checkout
      },{
        // !From sumon
        path:'payment',
        Component:Payment
      }
      // {
      //   path: `confirm-booking/:id`,
      //   Component: ConfirmBooking,
      // },
    ],
  },
]);

export default router;
