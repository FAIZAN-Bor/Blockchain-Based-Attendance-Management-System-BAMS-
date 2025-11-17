import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaLink, FaHome, FaBuilding, FaChalkboardTeacher, FaUserGraduate, FaClipboardCheck, FaCubes, FaSitemap } from 'react-icons/fa';

// Import pages
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Classes from './pages/Classes';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import BlockchainExplorer from './pages/BlockchainExplorer';
import HierarchyTree from './pages/HierarchyTree';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Router>
      <div className="app">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-brand">
              <FaLink />
              Blockchain Attendance System
            </div>
            <ul className="navbar-nav">
              <li>
                <Link
                  to="/"
                  className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <FaHome /> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/departments"
                  className={`nav-link ${activeTab === 'departments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('departments')}
                >
                  <FaBuilding /> Departments
                </Link>
              </li>
              <li>
                <Link
                  to="/classes"
                  className={`nav-link ${activeTab === 'classes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('classes')}
                >
                  <FaChalkboardTeacher /> Classes
                </Link>
              </li>
              <li>
                <Link
                  to="/students"
                  className={`nav-link ${activeTab === 'students' ? 'active' : ''}`}
                  onClick={() => setActiveTab('students')}
                >
                  <FaUserGraduate /> Students
                </Link>
              </li>
              <li>
                <Link
                  to="/attendance"
                  className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('attendance')}
                >
                  <FaClipboardCheck /> Attendance
                </Link>
              </li>
              <li>
                <Link
                  to="/blockchain"
                  className={`nav-link ${activeTab === 'blockchain' ? 'active' : ''}`}
                  onClick={() => setActiveTab('blockchain')}
                >
                  <FaCubes /> Blockchain Explorer
                </Link>
              </li>
              <li>
                <Link
                  to="/hierarchy"
                  className={`nav-link ${activeTab === 'hierarchy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('hierarchy')}
                >
                  <FaSitemap /> Hierarchy Tree
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/students" element={<Students />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/blockchain" element={<BlockchainExplorer />} />
            <Route path="/hierarchy" element={<HierarchyTree />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
