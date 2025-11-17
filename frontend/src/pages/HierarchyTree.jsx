import React, { useState, useEffect } from 'react';
import { FaBuilding, FaChalkboardTeacher, FaUserGraduate, FaLink, FaCheckCircle, FaExclamationTriangle, FaChevronDown, FaChevronRight, FaCube, FaSync, FaInfoCircle } from 'react-icons/fa';
import { departmentAPI, classAPI, studentAPI, blockchainAPI } from '../services/api';
import './HierarchyTree.css';

const HierarchyTree = () => {
  const [hierarchyData, setHierarchyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDepts, setExpandedDepts] = useState(new Set());
  const [expandedClasses, setExpandedClasses] = useState(new Set());
  const [validationStatus, setValidationStatus] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchHierarchyData();
  }, []);

  const fetchHierarchyData = async () => {
    setLoading(true);
    try {
      // Fetch all data - same pattern as other pages
      const [deptRes, classRes, studentRes, validationRes] = await Promise.all([
        departmentAPI.getAll(),
        classAPI.getAll(),
        studentAPI.getAll(),
        blockchainAPI.validate()
      ]);

      // Use the same data access pattern as Departments, Classes, Students pages
      const departments = deptRes.data.data || [];
      const classes = classRes.data.data || [];
      const students = studentRes.data.data || [];
      
      setValidationStatus(validationRes.data);

      console.log('Loaded departments:', departments.length);
      console.log('Loaded classes:', classes.length);
      console.log('Loaded students:', students.length);

      // Build hierarchy tree
      const hierarchy = departments.map(dept => {
        const deptClasses = classes.filter(c => c.departmentId === dept.id);
        
        return {
          ...dept,
          type: 'department',
          children: deptClasses.map(cls => {
            const classStudents = students.filter(s => s.classId === cls.id);
            
            return {
              ...cls,
              type: 'class',
              children: classStudents.map(student => ({
                ...student,
                type: 'student',
                children: [] // Attendance blocks shown in details panel
              }))
            };
          })
        };
      });

      console.log('Built hierarchy with', hierarchy.length, 'departments');
      setHierarchyData(hierarchy);
      
      // Auto-expand first department for better UX
      if (hierarchy.length > 0) {
        setExpandedDepts(new Set([hierarchy[0].id]));
      }
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Error loading hierarchy data. Please ensure the backend is running.');
    }
    setLoading(false);
  };

  const toggleDepartment = (deptId) => {
    setExpandedDepts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deptId)) {
        newSet.delete(deptId);
      } else {
        newSet.add(deptId);
      }
      return newSet;
    });
  };

  const toggleClass = (classId) => {
    setExpandedClasses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
  };

  const selectItem = (item) => {
    setSelectedItem(item);
  };

  const getValidationIcon = (type, id) => {
    if (!validationStatus) return null;
    
    let isValid = false;
    
    if (type === 'department') {
      const dept = validationStatus.departments?.details?.find(d => d.id === id);
      isValid = dept?.isValid;
    } else if (type === 'class') {
      const cls = validationStatus.classes?.details?.find(c => c.id === id);
      isValid = cls?.isValid;
    } else if (type === 'student') {
      const student = validationStatus.students?.details?.find(s => s.id === id);
      isValid = student?.isValid;
    }
    
    return isValid ? 
      <FaCheckCircle className="validation-icon valid" title="Valid" /> : 
      <FaExclamationTriangle className="validation-icon invalid" title="Invalid" />;
  };

  const getHashPreview = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  if (loading) {
    return (
      <div className="hierarchy-tree-page">
        <div className="page-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h1><FaCube /> Blockchain Hierarchy Tree</h1>
          <p>Loading 3-Layer Hierarchical Blockchain Structure...</p>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="hierarchy-tree-page">
      {/* Header */}
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1><FaCube /> Blockchain Hierarchy Tree</h1>
            <p>3-Layer Hierarchical Blockchain: Department → Class → Student → Attendance</p>
          </div>
          <button className="btn-primary" onClick={fetchHierarchyData}>
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <FaInfoCircle style={{ fontSize: '2rem', opacity: 0.9 }} />
        <div>
          <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Hierarchical Blockchain Architecture</h3>
          <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.95 }}>
            <strong>Layer 1 (Department):</strong> Genesis block with prevHash = '0' → 
            <strong> Layer 2 (Class):</strong> Genesis prevHash = Department's latest hash → 
            <strong> Layer 3 (Student):</strong> Genesis prevHash = Class's latest hash → 
            <strong> Attendance:</strong> Blocks appended to student chain
          </p>
        </div>
      </div>

      <div className="hierarchy-content">
        {/* Tree View */}
        <div className="tree-section">
          <div className="tree-header">
            <h2>Blockchain Tree Structure</h2>
            <div className="tree-stats">
              <span className="stat-badge">
                <FaBuilding /> {hierarchyData.length} Departments
              </span>
              <span className="stat-badge">
                <FaChalkboardTeacher /> {hierarchyData.reduce((acc, d) => acc + d.children.length, 0)} Classes
              </span>
              <span className="stat-badge">
                <FaUserGraduate /> {hierarchyData.reduce((acc, d) => acc + d.children.reduce((acc2, c) => acc2 + c.children.length, 0), 0)} Students
              </span>
            </div>
          </div>

          <div className="tree-container">
            {hierarchyData.length === 0 && !loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <FaInfoCircle style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
                <p>No data available. Please ensure the backend is running.</p>
                <button className="btn-primary" onClick={fetchHierarchyData} style={{ marginTop: '1rem' }}>
                  <FaSync /> Retry
                </button>
              </div>
            ) : null}
            {hierarchyData.map(dept => (
              <div key={dept.id} className="tree-node department-node">
                {/* Department Level */}
                <div 
                  className={`node-header ${selectedItem?.id === dept.id ? 'selected' : ''}`}
                  onClick={() => selectItem(dept)}
                >
                  <div className="node-expand" onClick={(e) => { e.stopPropagation(); toggleDepartment(dept.id); }}>
                    {expandedDepts.has(dept.id) ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                  <div className="node-content">
                    <div className="node-icon dept-icon">
                      <FaBuilding />
                    </div>
                    <div className="node-info">
                      <div className="node-title">
                        <strong>{dept.name}</strong>
                        <span className="node-badge dept-badge">{dept.code}</span>
                        {getValidationIcon('department', dept.id)}
                      </div>
                      <div className="node-meta">
                        Layer 1: Department Chain | Genesis prevHash: '0' | Blocks: {dept.chainStats?.length || 0}
                      </div>
                      <div className="node-hash">
                        <FaLink /> Latest: {getHashPreview(dept.chainStats?.latestHash)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Class Level */}
                {expandedDepts.has(dept.id) && (
                  <div className="node-children">
                    {dept.children.map(cls => (
                      <div key={cls.id} className="tree-node class-node">
                        <div 
                          className={`node-header ${selectedItem?.id === cls.id ? 'selected' : ''}`}
                          onClick={() => selectItem(cls)}
                        >
                          <div className="node-expand" onClick={(e) => { e.stopPropagation(); toggleClass(cls.id); }}>
                            {expandedClasses.has(cls.id) ? <FaChevronDown /> : <FaChevronRight />}
                          </div>
                          <div className="node-content">
                            <div className="node-icon class-icon">
                              <FaChalkboardTeacher />
                            </div>
                            <div className="node-info">
                              <div className="node-title">
                                <strong>{cls.name}</strong>
                                <span className="node-badge class-badge">Sem {cls.semester} - {cls.section}</span>
                                {getValidationIcon('class', cls.id)}
                              </div>
                              <div className="node-meta">
                                Layer 2: Class Chain | Genesis prevHash: Parent Dept Hash | Blocks: {cls.chainStats?.length || 0} | Students: {cls.children?.length || 0}
                              </div>
                              <div className="node-hash">
                                <FaLink /> Latest: {getHashPreview(cls.chainStats?.latestHash)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Student Level */}
                        {expandedClasses.has(cls.id) && (
                          <div className="node-children">
                            {cls.children.slice(0, 10).map(student => (
                              <div 
                                key={student.id} 
                                className={`tree-node student-node ${selectedItem?.id === student.id ? 'selected' : ''}`}
                                onClick={() => selectItem(student)}
                              >
                                <div className="node-content">
                                  <div className="node-icon student-icon">
                                    <FaUserGraduate />
                                  </div>
                                  <div className="node-info">
                                    <div className="node-title">
                                      <strong>{student.name}</strong>
                                      <span className="node-badge student-badge">{student.rollNumber}</span>
                                      {getValidationIcon('student', student.id)}
                                    </div>
                                    <div className="node-meta">
                                      Layer 3: Student Chain | Genesis prevHash: Parent Class Hash | Blocks: {student.chainStats?.length || 0}
                                    </div>
                                    <div className="node-hash">
                                      <FaLink /> Latest: {getHashPreview(student.chainStats?.latestHash)} | Email: {student.email}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {cls.children.length > 10 && (
                              <div className="tree-node more-node">
                                <div className="node-content">
                                  <span>... and {cls.children.length - 10} more students</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Details Panel */}
        <div className="details-section">
          <div className="details-header">
            <h2>Chain Details</h2>
          </div>
          
          {selectedItem ? (
            <div className="details-content">
              <div className="detail-card">
                <h3>
                  {selectedItem.type === 'department' && <><FaBuilding /> Department</>}
                  {selectedItem.type === 'class' && <><FaChalkboardTeacher /> Class</>}
                  {selectedItem.type === 'student' && <><FaUserGraduate /> Student</>}
                </h3>
                
                <div className="detail-section">
                  <h4>Basic Information</h4>
                  <table className="detail-table">
                    <tbody>
                      <tr>
                        <td><strong>ID:</strong></td>
                        <td><code>{selectedItem.id}</code></td>
                      </tr>
                      <tr>
                        <td><strong>Name:</strong></td>
                        <td>{selectedItem.name}</td>
                      </tr>
                      {selectedItem.code && (
                        <tr>
                          <td><strong>Code:</strong></td>
                          <td><span className="badge">{selectedItem.code}</span></td>
                        </tr>
                      )}
                      {selectedItem.rollNumber && (
                        <tr>
                          <td><strong>Roll Number:</strong></td>
                          <td><span className="badge">{selectedItem.rollNumber}</span></td>
                        </tr>
                      )}
                      {selectedItem.email && (
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{selectedItem.email}</td>
                        </tr>
                      )}
                      {selectedItem.semester && (
                        <tr>
                          <td><strong>Semester:</strong></td>
                          <td>{selectedItem.semester}</td>
                        </tr>
                      )}
                      {selectedItem.section && (
                        <tr>
                          <td><strong>Section:</strong></td>
                          <td><span className="badge">{selectedItem.section}</span></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="detail-section">
                  <h4>Blockchain Information</h4>
                  <table className="detail-table">
                    <tbody>
                      <tr>
                        <td><strong>Chain Type:</strong></td>
                        <td><span className="badge">{selectedItem.chainStats?.type}</span></td>
                      </tr>
                      <tr>
                        <td><strong>Chain Length:</strong></td>
                        <td>{selectedItem.chainStats?.length} blocks</td>
                      </tr>
                      <tr>
                        <td><strong>Latest Hash:</strong></td>
                        <td>
                          <code style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
                            {selectedItem.chainStats?.latestHash}
                          </code>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Validation Status:</strong></td>
                        <td>
                          {selectedItem.chainStats?.isValid ? (
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                              <FaCheckCircle /> Valid
                            </span>
                          ) : (
                            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                              <FaExclamationTriangle /> Invalid
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="detail-section">
                  <h4>Hierarchical Linking</h4>
                  <div style={{ 
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}>
                    {selectedItem.type === 'department' && (
                      <>
                        <p>
                          <strong>Layer 1 (Root):</strong> This department's genesis block has <code>prevHash = '0'</code>, 
                          making it the root of the hierarchy.
                        </p>
                        <p style={{ marginTop: '0.5rem' }}>
                          <strong>Child Classes:</strong> {selectedItem.children?.length || 0} classes extend from this department.
                          Each class's genesis block uses this department's latest hash as its prevHash.
                        </p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#ef4444' }}>
                          ⚠️ <strong>Cascade Effect:</strong> Modifying this department invalidates all {selectedItem.children?.length || 0} classes 
                          and their {selectedItem.children?.reduce((acc, c) => acc + (c.children?.length || 0), 0) || 0} students.
                        </p>
                      </>
                    )}
                    {selectedItem.type === 'class' && (
                      <>
                        <p>
                          <strong>Layer 2 (Middle):</strong> This class's genesis block has <code>prevHash = Parent Department's Latest Hash</code>.
                        </p>
                        <p style={{ marginTop: '0.5rem' }}>
                          <strong>Parent:</strong> Extends from department blockchain<br/>
                          <strong>Children:</strong> {selectedItem.children?.length || 0} students link to this class
                        </p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#ef4444' }}>
                          ⚠️ <strong>Cascade Effect:</strong> Modifying parent department OR this class invalidates all {selectedItem.children?.length || 0} students.
                        </p>
                      </>
                    )}
                    {selectedItem.type === 'student' && (
                      <>
                        <p>
                          <strong>Layer 3 (Leaf):</strong> This student's genesis block has <code>prevHash = Parent Class's Latest Hash</code>.
                        </p>
                        <p style={{ marginTop: '0.5rem' }}>
                          <strong>Attendance Blocks:</strong> {(selectedItem.chainStats?.length || 1) - 1} attendance records stored<br/>
                          <strong>Total Blocks:</strong> {selectedItem.chainStats?.length || 0} (including genesis)
                        </p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#ef4444' }}>
                          ⚠️ <strong>Cascade Effect:</strong> Modifying parent department OR class invalidates this student's entire attendance history.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="details-placeholder">
              <FaInfoCircle style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }} />
              <p>Select a node from the tree to view its blockchain details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HierarchyTree;
