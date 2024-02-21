import MainLayout from '@layouts/MainLayout';
import Dashboard from '@pages/AdminDashboard';
import Explore from '@pages/Explore';

import Home from '@pages/Home';
import Login from '@pages/Login';
import NotFound from '@pages/NotFound';
import People from '@pages/People';
import Profile from '@pages/Profile';
import Register from '@pages/Register';
import ResetPassword from '@pages/ResetPassword';
import Setting from '@pages/Setting';
import Trip from '@pages/Trip';

const routes = [
  {
    path: '/',
    name: 'Home',
    protected: false,
    component: Home,
    layout: MainLayout,
    role: 'User',
  },
  {
    path: '/home',
    name: 'Home',
    protected: false,
    component: Home,
    layout: MainLayout,
    role: 'User',
  },
  {
    path: '/login',
    name: 'Login',
    protected: false,
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    protected: false,
    component: Register,
  },
  {
    path: '/reset-password/:resetToken',
    name: 'Reset Password',
    protected: false,
    component: ResetPassword,
  },
  {
    path: '/people',
    name: 'People',
    protected: true,
    component: People,
    layout: MainLayout,
    role: 'User',
  },
  {
    path: '/profile',
    name: 'Profile',
    protected: true,
    component: Profile,
    layout: MainLayout,
    role: 'User',
  },
  {
    path: '/explore',
    name: 'Explore',
    protected: true,
    component: Explore,
    layout: MainLayout,
    role: 'User',
  },
  {
    path: '/trip',
    name: 'Trip',
    protected: true,
    component: Trip,
    layout: MainLayout,
    role: 'User',
  },
  {
    path: '/setting',
    name: 'Setting',
    protected: true,
    component: Setting,
    layout: MainLayout,
    role: 'User',
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    protected: true,
    component: Dashboard,
    layout: MainLayout,
    role: 'Admin',
  },

  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false },
];

export default routes;
