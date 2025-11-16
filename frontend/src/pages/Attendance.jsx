import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaCalendar, FaSearch, FaClipboardCheck, FaFilter, FaUserCheck, FaUserTimes, FaChartBar, FaHistory } from 'react-icons/fa';
import { attendanceAPI, studentAPI, classAPI, departmentAPI } from '../services/api';

function Attendance() {
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('mark'); // 'mark', 'today', 'history'
  const [selectedStudent, setSelectedStudent] = useState('');
  const [attendanceHistory, setAttendanceHistory] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept) {
      fetchClasses(selectedDept);
    }
  }, [selectedDept]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchClasses = async (deptId) => {
    try {
      const response = await classAPI.getAll(deptId);
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async (classId) => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll(classId);
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getToday(selectedClass, selectedDept);
      setTodayAttendance(response.data.data);
    } catch (error) {
      console.error('Error fetching today attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      await attendanceAPI.mark({ studentId, status });
      alert(`Attendance marked as ${status}`);
      if (view === 'today') {
        fetchTodayAttendance();
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Error marking attendance');
    }
  };

  const markBulkAttendance = async (status) => {
    if (!confirm(`Mark all students as ${status}?`)) return;
    try {
      const attendanceList = students.map(s => ({ studentId: s.id, status }));
      await attendanceAPI.markBulk(attendanceList);
      alert('Bulk attendance marked successfully');
      if (view === 'today') {
        fetchTodayAttendance();
      }
    } catch (error) {
      console.error('Error marking bulk attendance:', error);
      alert('Error marking bulk attendance');
    }
  };

  const viewStudentHistory = async () => {
    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }
    try {
      setLoading(true);
      const response = await attendanceAPI.getStudent(selectedStudent);
      setAttendanceHistory(response.data);
    } catch (error) {
      console.error('Error fetching student history:', error);
      alert('Error fetching attendance history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <FaClipboardCheck /> Attendance Management
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.95rem' }}>Track and manage student attendance secured by blockchain</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className="btn"
              style={{ background: view === 'mark' ? 'white' : 'rgba(255,255,255,0.3)', color: view === 'mark' ? 'var(--primary-color)' : 'white', border: '1px solid rgba(255,255,255,0.3)' }}
              onClick={() => setView('mark')}
            >
              <FaUserCheck /> Mark Attendance
            </button>
            <button 
              className="btn"
              style={{ background: view === 'today' ? 'white' : 'rgba(255,255,255,0.3)', color: view === 'today' ? 'var(--primary-color)' : 'white', border: '1px solid rgba(255,255,255,0.3)' }}
              onClick={() => { setView('today'); fetchTodayAttendance(); }}
            >
              <FaCalendar /> Today's Records
            </button>
            <button 
              className="btn"
              style={{ background: view === 'history' ? 'white' : 'rgba(255,255,255,0.3)', color: view === 'history' ? 'var(--primary-color)' : 'white', border: '1px solid rgba(255,255,255,0.3)' }}
              onClick={() => setView('history')}
            >
              <FaHistory /> Student History
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {/* Filters - Enhanced */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
              <FaFilter /> Department
            </label>
            <select
              className="form-select"
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setSelectedClass('');
                setStudents([]);
              }}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Class</label>
            <select
              className="form-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mark Attendance View */}
        {view === 'mark' && (
          <div>
            {students.length > 0 && (
              <>
                <div className="flex-between mb-2">
                  <h3>Students in {classes.find(c => c.id === selectedClass)?.name}</h3>
                  <div className="flex gap-1">
                    <button className="btn btn-success btn-sm" onClick={() => markBulkAttendance('present')}>
                      Mark All Present
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => markBulkAttendance('absent')}>
                      Mark All Absent
                    </button>
                  </div>
                </div>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Roll Number</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student.id}>
                          <td>{student.rollNumber}</td>
                          <td>{student.name}</td>
                          <td>
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => markAttendance(student.id, 'present')}
                            >
                              <FaCheckCircle /> Present
                            </button>
                            <button 
                              className="btn btn-danger btn-sm" 
                              style={{ marginLeft: '0.5rem' }}
                              onClick={() => markAttendance(student.id, 'absent')}
                            >
                              <FaTimesCircle /> Absent
                            </button>
                            <button 
                              className="btn btn-warning btn-sm" 
                              style={{ marginLeft: '0.5rem' }}
                              onClick={() => markAttendance(student.id, 'leave')}
                            >
                              <FaCalendar /> Leave
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {students.length === 0 && selectedClass && (
              <div className="text-center" style={{ padding: '2rem' }}>
                No students found in this class
              </div>
            )}
            {!selectedClass && (
              <div className="text-center" style={{ padding: '2rem' }}>
                Please select a department and class to mark attendance
              </div>
            )}
          </div>
        )}

        {/* Today's Attendance View */}
        {view === 'today' && (
          <div>
            {loading ? (
              <div className="loading"><div className="spinner"></div></div>
            ) : (
              <>
                <h3 className="mb-2">Today's Attendance - {new Date().toLocaleDateString()}</h3>
                {todayAttendance.length > 0 ? (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Roll Number</th>
                          <th>Name</th>
                          <th>Class</th>
                          <th>Status</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todayAttendance.map((record, idx) => (
                          <tr key={idx}>
                            <td>{record.rollNumber}</td>
                            <td>{record.studentName}</td>
                            <td>{classes.find(c => c.id === record.classId)?.name || record.classId}</td>
                            <td>
                              {record.status === 'present' && <span className="badge badge-success">Present</span>}
                              {record.status === 'absent' && <span className="badge badge-danger">Absent</span>}
                              {record.status === 'leave' && <span className="badge badge-warning">Leave</span>}
                              {record.status === 'unmarked' && <span className="badge badge-info">Unmarked</span>}
                            </td>
                            <td>{record.timestamp ? new Date(record.timestamp).toLocaleTimeString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center" style={{ padding: '2rem' }}>
                    No attendance records for today
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Student History View */}
        {view === 'history' && (
          <div>
            <div className="form-group">
              <label className="form-label">Select Student</label>
              <div className="flex gap-1">
                <select
                  className="form-select"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="">Choose a student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.rollNumber} - {student.name}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary" onClick={viewStudentHistory}>
                  <FaSearch /> View History
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading"><div className="spinner"></div></div>
            ) : attendanceHistory ? (
              <div>
                <div className="grid grid-4" style={{ gap: '1.5rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
                  <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', border: 'none', padding: '2rem' }}>
                    <FaChartBar style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }} />
                    <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Total Records</h4>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0, color: 'var(--text-color)' }}>
                      {attendanceHistory.statistics?.total || 0}
                    </p>
                  </div>
                  <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', border: 'none', padding: '2rem', color: 'white' }}>
                    <FaUserCheck style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.9 }} />
                    <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', opacity: 0.9 }}>Present</h4>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
                      {attendanceHistory.statistics?.present || 0}
                    </p>
                  </div>
                  <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', border: 'none', padding: '2rem', color: 'white' }}>
                    <FaUserTimes style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.9 }} />
                    <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', opacity: 0.9 }}>Absent</h4>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
                      {attendanceHistory.statistics?.absent || 0}
                    </p>
                  </div>
                  <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', padding: '2rem', color: 'white' }}>
                    <FaCheckCircle style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.9 }} />
                    <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', opacity: 0.9 }}>Attendance %</h4>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
                      {attendanceHistory.statistics?.percentage || 0}%
                    </p>
                  </div>
                </div>

                <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Complete History</h3>
                {attendanceHistory.data && attendanceHistory.data.length > 0 ? (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Block Index</th>
                          <th>Block Hash</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceHistory.data.map((record, idx) => (
                          <tr key={idx}>
                            <td>{new Date(record.timestamp).toLocaleDateString()}</td>
                            <td>
                              {record.status === 'present' && <span className="badge badge-success">Present</span>}
                              {record.status === 'absent' && <span className="badge badge-danger">Absent</span>}
                              {record.status === 'leave' && <span className="badge badge-warning">Leave</span>}
                            </td>
                            <td>{record.blockIndex}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                              {record.blockHash?.substring(0, 20)}...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center" style={{ padding: '2rem' }}>
                    No attendance records found for this student
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
