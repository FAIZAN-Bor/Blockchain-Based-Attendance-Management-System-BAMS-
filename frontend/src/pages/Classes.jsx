import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaChalkboardTeacher, FaCheckCircle, FaExclamationTriangle, FaLink, FaTimes, FaFilter } from 'react-icons/fa';
import { classAPI, departmentAPI } from '../services/api';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', departmentId: '', semester: '', section: '' });

  useEffect(() => {
    fetchDepartments();
    fetchClasses();
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
      setLoading(true);
      const response = await classAPI.getAll(deptId);
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchClasses(filterDept);
      return;
    }
    try {
      const response = await classAPI.search(searchQuery, filterDept);
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await classAPI.create(formData);
      alert('Class created successfully');
      setShowModal(false);
      resetForm();
      fetchClasses(filterDept);
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Error creating class: ' + error.response?.data?.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { id, ...updates } = formData;
      await classAPI.update(currentClass.id, updates);
      alert('Class updated successfully');
      setShowModal(false);
      resetForm();
      fetchClasses(filterDept);
    } catch (error) {
      console.error('Error updating class:', error);
      alert('Error updating class');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      await classAPI.delete(id);
      alert('Class marked as deleted');
      fetchClasses(filterDept);
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Error deleting class');
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentClass(null);
    setFormData({ id: `class-${Date.now()}`, name: '', departmentId: filterDept || '', semester: '', section: '' });
    setShowModal(true);
  };

  const openEditModal = (cls) => {
    setEditMode(true);
    setCurrentClass(cls);
    setFormData({ id: cls.id, name: cls.name, departmentId: cls.departmentId, semester: cls.semester, section: cls.section });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', departmentId: '', semester: '', section: '' });
    setEditMode(false);
    setCurrentClass(null);
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : deptId;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <h2 style={{ color: 'var(--text-light)' }}>Loading Classes...</h2>
        <p>Please wait while we fetch the data.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FaChalkboardTeacher /> Classes Management
          </h1>
          <button className="btn" style={{ background: 'white', color: 'var(--primary-color)' }} onClick={openCreateModal}>
            <FaPlus /> Add Class
          </button>
        </div>
        <p style={{ margin: '1rem 0 0 0', opacity: 0.9, fontSize: '0.95rem' }}>Manage class records linked to departments via blockchain</p>
      </div>

      <div className="card">
        {/* Filters - Enhanced */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '600' }}>
            <FaFilter /> Filter by Department
          </label>
          <select
            className="form-select"
            value={filterDept}
            onChange={(e) => {
              setFilterDept(e.target.value);
              fetchClasses(e.target.value);
            }}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
            ))}
          </select>
          {filterDept && (
            <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
              Showing classes from: <strong>{departments.find(d => d.id === filterDept)?.name}</strong>
            </small>
          )}
        </div>

        {/* Search - Enhanced */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <FaSearch /> Search Classes
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by class name, semester, or section..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{ paddingRight: searchQuery ? '2.5rem' : '1rem' }}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); fetchClasses(filterDept); }}
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
                <th>ID</th>
                <th>Class Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Section</th>
                <th>Blockchain</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id}>
                  <td><code style={{ fontSize: '0.8rem', background: 'var(--light-bg)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>{cls.id}</code></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaChalkboardTeacher style={{ color: 'var(--primary-color)' }} />
                      <strong>{cls.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'var(--secondary-color)', color: 'white' }}>
                      {departments.find(d => d.id === cls.departmentId)?.code || cls.departmentId}
                    </span>
                    <br />
                    <small style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>{getDepartmentName(cls.departmentId)}</small>
                  </td>
                  <td><span className="badge" style={{ background: 'var(--primary-color)', color: 'white' }}>Sem {cls.semester}</span></td>
                  <td><span className="badge" style={{ background: 'var(--light-bg)', color: 'var(--text-color)' }}>Section {cls.section}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaLink style={{ color: 'var(--text-light)', fontSize: '0.9rem' }} />
                      <span><strong>{cls.chainStats?.length || 0}</strong> blocks</span>
                    </div>
                  </td>
                  <td>
                    {cls.chainStats?.isValid ? (
                      <span className="badge badge-success"><FaCheckCircle /> Valid</span>
                    ) : (
                      <span className="badge badge-danger"><FaExclamationTriangle /> Invalid</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-warning btn-sm" onClick={() => openEditModal(cls)} title="Edit class">
                        <FaEdit /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cls.id)} title="Delete class">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {classes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--light-bg)', borderRadius: '0.5rem' }}>
              <FaChalkboardTeacher style={{ fontSize: '4rem', color: 'var(--text-light)', marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>No Classes Found</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                {searchQuery ? 'Try adjusting your search criteria' : filterDept ? 'No classes in this department yet' : 'Get started by adding your first class'}
              </p>
              {!searchQuery && (
                <button className="btn btn-primary" onClick={openCreateModal}>
                  <FaPlus /> Add First Class
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal - Enhanced */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <FaChalkboardTeacher /> {editMode ? 'Edit Class' : 'Create New Class'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)} style={{ color: 'white', opacity: 0.9 }}>&times;</button>
            </div>
            <form onSubmit={editMode ? handleUpdate : handleCreate} style={{ padding: '1.5rem' }}>
              {!editMode && (
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600' }}>
                    Class ID <span style={{ color: 'var(--danger-color)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., class-001"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    required
                    disabled={editMode}
                    autoFocus
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Unique identifier for the class</small>
                </div>
              )}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600' }}>
                  Class Name <span style={{ color: 'var(--danger-color)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Software Engineering"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoFocus={editMode}
                />
                <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Full name of the class</small>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600' }}>
                  Department <span style={{ color: 'var(--danger-color)' }}>*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  required
                  disabled={editMode}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
                  ))}
                </select>
                <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {editMode ? 'Department cannot be changed after creation' : 'Select the parent department for this class'}
                </small>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600' }}>
                    Semester
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="1-8"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    min="1"
                    max="8"
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Optional</small>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600' }}>
                    Section
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., A"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
                    maxLength="5"
                    style={{ textTransform: 'uppercase' }}
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Optional</small>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editMode ? <><FaEdit /> Update</> : <><FaPlus /> Create</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classes;
