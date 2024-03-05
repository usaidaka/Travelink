import MainLayout from '@layouts/MainLayout';
import Dashboard from '@pages/AdminDashboard';
import ChangePassword from '@pages/ChangePassword';
import RegisterDestination from '@pages/RegisterDestination';
import EditPost from '@pages/EditPost';
import Explore from '@pages/Explore';
import Group from '@pages/Group';

import Home from '@pages/Home';
import Login from '@pages/Login';
import NotFound from '@pages/NotFound';
import People from '@pages/People';
import Profile from '@pages/Profile';
import Register from '@pages/Register';
import ResetPassword from '@pages/ResetPassword';
import Setting from '@pages/Setting';
import Trip from '@pages/Trip';
import UserProfile from '@pages/UserProfile';
import Destination from '@pages/Destination';
import EditDestination from '@pages/EditDestination';
import DestinationRecommendation from '@pages/DestinationRecommendation';
import NearbyCurrent from '@pages/NearbyCurrent';
import NearbyDirection from '@pages/NearbyDirection';

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
    path: '/post/:postId',
    name: 'Edit Post',
    protected: true,
    component: EditPost,
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
    path: '/profile/:userId',
    name: 'User Profile',
    protected: true,
    component: UserProfile,
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
    path: 'setting/change-password',
    name: 'Change Password',
    protected: true,
    component: ChangePassword,
    layout: MainLayout,
    role: 'User',
  },
  {
    path: '/group',
    name: 'Group',
    protected: true,
    component: Group,
    layout: MainLayout,
    role: 'User',
  },
  {
    path: '/nearby',
    name: 'Nearby',
    protected: true,
    component: NearbyCurrent,
    layout: MainLayout,
    role: 'User',
  },
  {
    path: '/nearby/direction',
    name: 'Nearby',
    protected: true,
    component: NearbyDirection,
    layout: MainLayout,
    role: 'User',
  },
  {
    path: '/destination-recommendation',
    name: 'Destination Recommendation',
    protected: true,
    component: DestinationRecommendation,
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
  {
    path: '/admin/destination',
    name: 'Destination',
    protected: true,
    component: Destination,
    layout: MainLayout,
    role: 'Admin',
  },
  {
    path: '/admin/destination/register',
    name: 'Register Destination',
    protected: true,
    component: RegisterDestination,
    layout: MainLayout,
    role: 'Admin',
  },
  {
    path: '/admin/destination/:destinationId',
    name: 'Register Destination',
    protected: true,
    component: EditDestination,
    layout: MainLayout,
    role: 'Admin',
  },

  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false },
];

export default routes;
