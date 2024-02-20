import MainLayout from '@layouts/MainLayout';
import Dashboard from '@pages/AdminDashboard';

import Home from '@pages/Home';
import Login from '@pages/Login';
import NotFound from '@pages/NotFound';
import Register from '@pages/Register';
import ResetPassword from '@pages/ResetPassword';

const routes = [
  {
    path: '/',
    name: 'Home',
    protected: false,
    component: Home,
    layout: MainLayout,
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
