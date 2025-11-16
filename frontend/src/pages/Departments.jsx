import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBuilding, FaCheckCircle, FaExclamationTriangle, FaLink, FaTimes } from 'react-icons/fa';
import { departmentAPI } from '../services/api';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', code: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      alert('Error fetching departments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchDepartments();
      return;
    }
    try {
      const response = await departmentAPI.search(searchQuery);
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await departmentAPI.create(formData);
      alert('Department created successfully');
      setShowModal(false);
      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Error creating department');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await departmentAPI.update(currentDept.id, { name: formData.name, code: formData.code });
      alert('Department updated successfully');
      setShowModal(false);
      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error('Error updating department:', error);
      alert('Error updating department');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      await departmentAPI.delete(id);
      alert('Department marked as deleted');
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Error deleting department');
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentDept(null);
    setFormData({ id: `dept-${Date.now()}`, name: '', code: '' });
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setEditMode(true);
    setCurrentDept(dept);
    setFormData({ id: dept.id, name: dept.name, code: dept.code });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', code: '' });
    setEditMode(false);
    setCurrentDept(null);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <h2 style={{ color: 'var(--text-light)' }}>Loading Departments...</h2>
        <p>Please wait while we fetch the data.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FaBuilding /> Departments Management
          </h1>
          <button className="btn" style={{ background: 'white', color: 'var(--primary-color)' }} onClick={openCreateModal}>
            <FaPlus /> Add Department
          </button>
        </div>
        <p style={{ margin: '1rem 0 0 0', opacity: 0.9, fontSize: '0.95rem' }}>Manage department records and their blockchain chains</p>
      </div>

      <div className="card">

        {/* Search - Enhanced */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <FaSearch /> Search Departments
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by department name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{ paddingRight: searchQuery ? '2.5rem' : '1rem' }}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); fetchDepartments(); }}
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
                <th>Department Name</th>
                <th>Code</th>
                <th>Blockchain</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} style={{ cursor: 'default' }}>
                  <td><code style={{ fontSize: '0.8rem', background: 'var(--light-bg)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>{dept.id}</code></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaBuilding style={{ color: 'var(--primary-color)' }} />
                      <strong>{dept.name}</strong>
                    </div>
                  </td>
                  <td><span className="badge" style={{ background: 'var(--primary-color)', color: 'white' }}>{dept.code}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaLink style={{ color: 'var(--text-light)', fontSize: '0.9rem' }} />
                      <span><strong>{dept.chainStats?.length || 0}</strong> blocks</span>
                    </div>
                  </td>
                  <td>
                    {dept.chainStats?.isValid ? (
                      <span className="badge badge-success"><FaCheckCircle /> Valid</span>
                    ) : (
                      <span className="badge badge-danger"><FaExclamationTriangle /> Invalid</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-warning btn-sm" onClick={() => openEditModal(dept)} title="Edit department">
                        <FaEdit /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(dept.id)} title="Delete department">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {departments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--light-bg)', borderRadius: '0.5rem' }}>
              <FaBuilding style={{ fontSize: '4rem', color: 'var(--text-light)', marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>No Departments Found</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                {searchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first department'}
              </p>
              {!searchQuery && (
                <button className="btn btn-primary" onClick={openCreateModal}>
                  <FaPlus /> Add First Department
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal - Enhanced */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <FaBuilding /> {editMode ? 'Edit Department' : 'Create New Department'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)} style={{ color: 'white', opacity: 0.9 }}>&times;</button>
            </div>
            <form onSubmit={editMode ? handleUpdate : handleCreate} style={{ padding: '1.5rem' }}>
              {!editMode && (
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600' }}>
                    Department ID <span style={{ color: 'var(--danger-color)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., dept-001"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    required
                    disabled={editMode}
                    autoFocus
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Unique identifier for the department</small>
                </div>
              )}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600' }}>
                  Department Name <span style={{ color: 'var(--danger-color)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Computer Science"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoFocus={editMode}
                />
                <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Full name of the department</small>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600' }}>
                  Department Code <span style={{ color: 'var(--danger-color)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., CS"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  maxLength="10"
                  style={{ textTransform: 'uppercase' }}
                />
                <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Short code (2-10 characters)</small>
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

export default Departments;
