import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaLink, FaUserGraduate, FaCheckCircle, FaExclamationTriangle, FaTimes, FaFilter, FaClipboardList } from 'react-icons/fa';
import { studentAPI, classAPI, departmentAPI } from '../services/api';

function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showLedger, setShowLedger] = useState(false);
  const [ledgerData, setLedgerData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', rollNumber: '', departmentId: '', classId: '', email: '' });

  useEffect(() => {
    fetchDepartments();
    fetchClasses();
    fetchStudents();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchClasses = async (deptId = '') => {
    try {
      const response = await classAPI.getAll(deptId);
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async (classId = '', deptId = '') => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll(classId, deptId);
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchStudents(filterClass, filterDept);
      return;
    }
    try {
      const response = await studentAPI.search(searchQuery, filterClass, filterDept);
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.create(formData);
      alert('Student created successfully');
      setShowModal(false);
      resetForm();
      fetchStudents(filterClass, filterDept);
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Error creating student: ' + error.response?.data?.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { id, ...updates } = formData;
      await studentAPI.update(currentStudent.id, updates);
      alert('Student updated successfully');
      setShowModal(false);
      resetForm();
      fetchStudents(filterClass, filterDept);
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await studentAPI.delete(id);
      alert('Student marked as deleted');
      fetchStudents(filterClass, filterDept);
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Error deleting student');
    }
  };

  const viewLedger = async (studentId) => {
    try {
      const response = await studentAPI.getLedger(studentId);
      setLedgerData(response.data);
      setShowLedger(true);
    } catch (error) {
      console.error('Error fetching ledger:', error);
      alert('Error fetching student ledger');
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentStudent(null);
    setFormData({ id: `student-${Date.now()}`, name: '', rollNumber: '', departmentId: filterDept || '', classId: filterClass || '', email: '' });
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditMode(true);
    setCurrentStudent(student);
    setFormData({ 
      id: student.id, 
      name: student.name, 
      rollNumber: student.rollNumber, 
      departmentId: student.departmentId, 
      classId: student.classId, 
      email: student.email 
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', rollNumber: '', departmentId: '', classId: '', email: '' });
    setEditMode(false);
    setCurrentStudent(null);
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : deptId;
  };

  const getClassName = (classId) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : classId;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <h2 style={{ color: 'var(--text-light)' }}>Loading Students...</h2>
        <p>Please wait while we fetch the data.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FaUserGraduate /> Students Management
          </h1>
          <button className="btn" style={{ background: 'white', color: 'var(--primary-color)' }} onClick={openCreateModal}>
            <FaPlus /> Add Student
          </button>
        </div>
        <p style={{ margin: '1rem 0 0 0', opacity: 0.9, fontSize: '0.95rem' }}>Manage student records with blockchain-secured attendance tracking</p>
      </div>

      <div className="card">
        {/* Filters - Enhanced */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
              <FaFilter /> Filter by Department
            </label>
            <select
              className="form-select"
              value={filterDept}
              onChange={(e) => {
                setFilterDept(e.target.value);
                fetchClasses(e.target.value);
                fetchStudents('', e.target.value);
              }}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
              ))}
            </select>
            {filterDept && (
              <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                Selected: <strong>{departments.find(d => d.id === filterDept)?.name}</strong>
              </small>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
              <FaFilter /> Filter by Class
            </label>
            <select
              className="form-select"
              value={filterClass}
              onChange={(e) => {
                setFilterClass(e.target.value);
                fetchStudents(e.target.value, filterDept);
              }}
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name} - {cls.section}</option>
              ))}
            </select>
            {filterClass && (
              <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                Selected: <strong>{classes.find(c => c.id === filterClass)?.name}</strong>
              </small>
            )}
          </div>
        </div>

        {/* Search - Enhanced */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <FaSearch /> Search Students
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by name, roll number, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{ paddingRight: searchQuery ? '2.5rem' : '1rem' }}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); fetchStudents(filterClass, filterDept); }}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-light)',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                  title="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button className="btn btn-primary" onClick={handleSearch}>
              <FaSearch /> Search
            </button>
          </div>
        </div>

        {/* Table - Enhanced */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Class</th>
                <th>Blockchain</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td><span className="badge" style={{ background: 'var(--primary-color)', color: 'white', fontSize: '0.9rem' }}>{student.rollNumber}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaUserGraduate style={{ color: 'var(--primary-color)' }} />
                      <strong>{student.name}</strong>
                    </div>
                  </td>
                  <td><small style={{ color: 'var(--text-light)' }}>{student.email}</small></td>
                  <td>
                    <span className="badge" style={{ background: 'var(--secondary-color)', color: 'white' }}>
                      {departments.find(d => d.id === student.departmentId)?.code || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <small>{getClassName(student.classId)}</small>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaLink style={{ color: 'var(--text-light)', fontSize: '0.9rem' }} />
                      <span><strong>{student.chainStats?.length || 0}</strong> blocks</span>
                    </div>
                  </td>
                  <td>
                    {student.chainStats?.isValid ? (
                      <span className="badge badge-success"><FaCheckCircle /> Valid</span>
                    ) : (
                      <span className="badge badge-danger"><FaExclamationTriangle /> Invalid</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-success btn-sm" onClick={() => viewLedger(student.id)} title="View attendance ledger">
                        <FaClipboardList /> Ledger
                      </button>
                      <button className="btn btn-warning btn-sm" onClick={() => openEditModal(student)} title="Edit student">
                        <FaEdit /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student.id)} title="Delete student">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--light-bg)', borderRadius: '0.5rem' }}>
              <FaUserGraduate style={{ fontSize: '4rem', color: 'var(--text-light)', marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>No Students Found</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                {searchQuery ? 'Try adjusting your search criteria' : filterClass ? 'No students enrolled in this class yet' : 'Get started by adding your first student'}
              </p>
              {!searchQuery && (
                <button className="btn btn-primary" onClick={openCreateModal}>
                  <FaPlus /> Add First Student
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editMode ? 'Edit Student' : 'Create Student'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={editMode ? handleUpdate : handleCreate}>
              {!editMode && (
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    required
                    disabled={editMode}
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Student Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={formData.departmentId}
                  onChange={(e) => {
                    setFormData({ ...formData, departmentId: e.target.value, classId: '' });
                    fetchClasses(e.target.value);
                  }}
                  required
                  disabled={editMode}
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
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  required
                  disabled={editMode}
                >
                  <option value="">Select Class</option>
                  {classes.filter(c => c.departmentId === formData.departmentId).map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ledger Modal */}
      {showLedger && ledgerData && (
        <div className="modal-overlay" onClick={() => setShowLedger(false)}>
          <div className="modal" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Student Attendance Ledger (Blockchain)</h2>
              <button className="modal-close" onClick={() => setShowLedger(false)}>&times;</button>
            </div>
            <div>
              <p><strong>Student ID:</strong> {ledgerData.studentId}</p>
              <p><strong>Total Records:</strong> {ledgerData.totalRecords}</p>
              <p><strong>Chain Length:</strong> {ledgerData.chainStats?.length} blocks</p>
              <p><strong>Chain Valid:</strong> {ledgerData.chainStats?.isValid ? '✓ Yes' : '✗ No'}</p>
              
              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Attendance Records</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Block #</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Block Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerData.attendance && ledgerData.attendance.length > 0 ? (
                      ledgerData.attendance.map((record, idx) => (
                        <tr key={idx}>
                          <td>{record.blockIndex}</td>
                          <td>{new Date(record.timestamp).toLocaleDateString()}</td>
                          <td>
                            {record.status === 'present' && <span className="badge badge-success">Present</span>}
                            {record.status === 'absent' && <span className="badge badge-danger">Absent</span>}
                            {record.status === 'leave' && <span className="badge badge-warning">Leave</span>}
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{record.blockHash?.substring(0, 20)}...</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No attendance records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowLedger(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
