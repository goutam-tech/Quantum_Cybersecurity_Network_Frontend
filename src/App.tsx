import React, { useState } from 'react';
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
} from 'chart.js';
import './index.css';

import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { Upload } from './components/Upload';
import { Logs } from './components/Logs';
import { Threats } from './components/Threats';
import { Health } from './components/Health';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <>
      <div className="liquid-bg">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
        <div className="blob blob4"></div>
      </div>

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
            {activePage === 'health' && <Health />}
          </div>
        </main>
      </div>
    </>
  );
}