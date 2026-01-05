import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

import DoctorDashboard from './pages/Doctor/Dashboard';
import CurrentShift from './pages/Doctor/CurrentShift';

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => console.log('ServiceWorker registration successful'))
        .catch(error => console.log('ServiceWorker registration failed: ', error));
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<DoctorDashboard />} />
                <Route path="/doctor" element={<DoctorDashboard />} />
                <Route path="/doctor/shift" element={<CurrentShift />} />
                <Route path="*" element={<DoctorDashboard />} /> {/* Catch-all */}
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
      </AuthProvider>
    </Router>
  );
}

export default App;