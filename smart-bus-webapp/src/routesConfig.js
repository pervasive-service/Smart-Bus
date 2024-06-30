import Dashboard from './pages/Dashboard';
import TripManagement from './pages/TripManagement';
import RouteManagement from './pages/RouteManagement';
import Settings from './pages/Settings';
import UserProfilePage from './pages/UserProfilePage';
import SignInPage from './pages/SignInPage';
import EmployeeManagement from './pages/EmployeeManagement';

const routesConfig = [
  { path: '/home', component: EmployeeManagement, roles: ['admin', 'user', 'manager'] },
  { path: '/dashboard', component: Dashboard, roles: ['admin', 'user'] },
  { path: '/trips', component: TripManagement, roles: ['admin'] },
  { path: '/routes', component: RouteManagement, roles: ['admin', 'manager'] },
  { path: '/settings', component: Settings, roles: ['admin'] },
  { path: '/profile', component: UserProfilePage, roles: ['admin', 'user', 'manager'] },
  { path: '/login', component: SignInPage, roles: [] },
];

export default routesConfig;
