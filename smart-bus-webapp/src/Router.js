// src/routes.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TripManagement from './pages/TripManagement';
import RouteManagement from './pages/RouteManagement';
import Settings from './pages/Settings';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/SignInPage';
import EmployeeManagement from './pages/EmployeeManagement';
// import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './utils/ProtectedRoutes';
import BulkUploadPage from './pages/BulkUploadPage';
import BusManagement from './pages/BusManagement';
import ScheduleManagement from './pages/ScheduleManagement';
const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/home" element={ <ProtectedRoute><EmployeeManagement /></ProtectedRoute>  } /> */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<Dashboard />} />
      <Route path="/fleet-management" element={<TripManagement />} />
      <Route path="/vehicles" element={<BusManagement />} />
      <Route path="/employees" element={<EmployeeManagement />} />
      <Route path="/schedules" element={<ScheduleManagement />} />
      <Route path="/routes" element={<RouteManagement />} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/bulk-inventory" element={<BulkUploadPage />} />
     
      {/* <Route path="/register" element={<RegisterPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;



