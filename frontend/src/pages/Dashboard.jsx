import React, { useState, useEffect } from 'react';
import { FaBuilding, FaChalkboardTeacher, FaUserGraduate, FaCubes, FaCheckCircle, FaExclamationTriangle, FaSync, FaShieldAlt, FaChartLine } from 'react-icons/fa';
import { blockchainAPI, departmentAPI, classAPI, studentAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, validationRes] = await Promise.all([
        blockchainAPI.getStats(),
        blockchainAPI.validate()
      ]);
      setStats(statsRes.data.data);
      setValidation(validationRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Error loading dashboard data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <h2 style={{ color: 'var(--text-light)' }}>Loading Dashboard...</h2>
        <p>Please wait while we fetch your data.</p>
      </div>
    );
  }

  if (!stats || !validation) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
        <FaExclamationTriangle style={{ fontSize: '4rem', marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '1rem' }}>Error Loading Dashboard</h2>
        <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>Unable to fetch dashboard data. Please ensure the backend server is running on port 5000.</p>
        <button className="btn" style={{ background: 'white', color: 'var(--primary-color)' }} onClick={fetchDashboardData}>
          <FaSync /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FaChartLine /> Dashboard Overview
          </h1>
          <button 
            className="btn" 
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <FaSync className={refreshing ? 'spinning' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Stats Grid - Enhanced with Gradients */}
      <div className="grid grid-4" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '2rem' }}>
          <FaBuilding style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.9 }} />
          <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Departments</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{stats?.activeDepartments || 0}</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>Active</p>
        </div>

        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '2rem' }}>
          <FaChalkboardTeacher style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.9 }} />
          <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Classes</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{stats?.activeClasses || 0}</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>Active</p>
        </div>

        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '2rem' }}>
          <FaUserGraduate style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.9 }} />
          <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Students</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{stats?.activeStudents || 0}</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>Enrolled</p>
        </div>

        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white', padding: '2rem' }}>
          <FaCubes style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.9 }} />
          <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Blockchain</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{stats?.totalBlocks || 0}</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>Total Blocks</p>
        </div>
      </div>

      {/* Blockchain Validation Status - Enhanced */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FaShieldAlt /> Blockchain Validation Status
          </h2>
          {validation?.overallValid ? (
            <span className="badge badge-success" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              <FaCheckCircle /> All Chains Valid
            </span>
          ) : (
            <span className="badge badge-danger" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              <FaExclamationTriangle /> Invalid Chains Detected
            </span>
          )}
        </div>

        <div className="grid grid-3" style={{ gap: '1.5rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <FaBuilding style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Department Chains</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Root level chains</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--secondary-color)' }}>{validation?.departments.valid}</p>
                <span className="badge badge-success" style={{ marginTop: '0.5rem' }}>Valid</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--danger-color)' }}>{validation?.departments.invalid}</p>
                <span className="badge badge-danger" style={{ marginTop: '0.5rem' }}>Invalid</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <FaChalkboardTeacher style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Class Chains</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Linked to departments</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--secondary-color)' }}>{validation?.classes.valid}</p>
                <span className="badge badge-success" style={{ marginTop: '0.5rem' }}>Valid</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--danger-color)' }}>{validation?.classes.invalid}</p>
                <span className="badge badge-danger" style={{ marginTop: '0.5rem' }}>Invalid</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <FaUserGraduate style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Student Chains</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Linked to classes</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--secondary-color)' }}>{validation?.students.valid}</p>
                <span className="badge badge-success" style={{ marginTop: '0.5rem' }}>Valid</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--danger-color)' }}>{validation?.students.invalid}</p>
                <span className="badge badge-danger" style={{ marginTop: '0.5rem' }}>Invalid</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Information - Enhanced */}
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <FaCubes /> Detailed System Information
        </h2>
        <div className="table-container">
          <table className="table" style={{ fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: 'var(--light-bg)' }}>
                <th style={{ width: '60%' }}>Metric</th>
                <th style={{ textAlign: 'center' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaBuilding style={{ color: 'var(--primary-color)' }} />
                    <strong>Total Departments</strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: '1.5rem' }}>Including soft-deleted records</span>
                </td>
                <td style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>{stats?.totalDepartments}</td>
              </tr>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaChalkboardTeacher style={{ color: 'var(--primary-color)' }} />
                    <strong>Total Classes</strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: '1.5rem' }}>Including soft-deleted records</span>
                </td>
                <td style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>{stats?.totalClasses}</td>
              </tr>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaUserGraduate style={{ color: 'var(--primary-color)' }} />
                    <strong>Total Students</strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: '1.5rem' }}>Including soft-deleted records</span>
                </td>
                <td style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>{stats?.totalStudents}</td>
              </tr>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaCubes style={{ color: 'var(--primary-color)' }} />
                    <strong>Total Blockchain Blocks</strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: '1.5rem' }}>Across all chains combined</span>
                </td>
                <td style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>{stats?.totalBlocks}</td>
              </tr>
              <tr style={{ background: validation?.overallValid ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaShieldAlt style={{ color: validation?.overallValid ? 'var(--secondary-color)' : 'var(--danger-color)' }} />
                    <strong>System Status</strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: '1.5rem' }}>Overall blockchain health</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {validation?.overallValid ? (
                    <span className="badge badge-success" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                      <FaCheckCircle /> Operational
                    </span>
                  ) : (
                    <span className="badge badge-danger" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                      <FaExclamationTriangle /> Issues Detected
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
