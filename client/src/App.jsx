import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
// Doctor Pages
import DoctorDashboard from './pages/Doctor/Dashboard';
import CurrentShift from './pages/Doctor/CurrentShift';
import ShiftHistory from './pages/Doctor/ShiftHistory';
import QRScanner from './pages/Doctor/QRScanner';
// HR Pages
import HRDashboard from './pages/HR/Dashboard';
import ShiftPlanner from './pages/HR/ShiftPlanner';
import LiveBoard from './pages/HR/LiveBoard';
import Reports from './pages/HR/Reports';
import AuditLog from './pages/HR/AuditLog';
// Admin Pages
import SystemConfig from './pages/Admin/SystemConfig';
import UserManagement from './pages/Admin/UserManagement';
import Departments from './pages/Admin/Departments';
// Auth Pages
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
// Shared Pages
import Profile from './pages/Shared/Profile';
import Notifications from './pages/Shared/Notifications';
import Settings from './pages/Shared/Settings';
function App() {
// Register service worker for PWA
useEffect(() => {
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
navigator.serviceWorker.register('/service-worker.js')
.then(registration => {
console.log('ServiceWorker registration successful');
})
.catch(error => {
console.log('ServiceWorker registration failed: ', error);
});
}
}, []);

return (
  <Router>
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              <Routes>
  {/* Bypass login - go straight to Doctor Dashboard */}
  <Route path="/" element={<DoctorDashboard />} />
  
  {/* Optional: direct access to other pages */}
  <Route path="/doctor" element={<DoctorDashboard />} />
  <Route path="/doctor/shift" element={<CurrentShift />} />
  <Route path="/doctor/history" element={<ShiftHistory />} />
  <Route path="/doctor/scan" element={<QRScanner />} />
  
  <Route path="/hr" element={<HRDashboard />} />
  <Route path="/admin/users" element={<UserManagement />} />
  
  {/* Keep login if you want to test it later */}
  <Route path="/login" element={<Login />} />
  
  {/* Catch all */}
  <Route path="*" element={<DoctorDashboard />} />
</Routes>
            </main>
            <Footer />
          </div>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#363636', color: '#fff' },
            success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </NotificationProvider>
    </AuthProvider>
  </Router>
);
}
export default App;