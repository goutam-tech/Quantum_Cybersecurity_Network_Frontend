import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import './index.css';

import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { Upload } from './components/Upload';
import { Logs } from './components/Logs';
import { Threats } from './components/Threats';
// import { Health } from './components/Health';

import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="full-loader show">
        <div className="loader-ring"></div>
        <div className="loader-ring2"></div>
        <div className="loader-text">INITIALIZING CORE...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <Login onToggleSignup={() => setAuthView('signup')} />
    ) : (
      <Signup onToggleLogin={() => setAuthView('login')} />
    );
  }

  return (
    <>
      <div className="layout">

        {/* Sidebar */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        {/* Main Content */}
        <main className="main">
          {/* Topbar */}
          <Topbar activePage={activePage} />

          <div className="content">
            {activePage === 'dashboard' && <Dashboard />}
            {activePage === 'upload' && <Upload onAnalyzeComplete={() => setActivePage('dashboard')} />}
            {activePage === 'logs' && <Logs />}
            {activePage === 'threats' && <Threats />}
            {/* {activePage === 'health' && <Health />} */}
          </div>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}