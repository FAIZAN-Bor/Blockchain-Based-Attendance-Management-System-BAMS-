import React, { useState, useEffect } from 'react';
import { FaCube, FaCheckCircle, FaExclamationTriangle, FaChevronRight, FaLink, FaHashtag, FaClock, FaDatabase, FaShieldAlt, FaSearch } from 'react-icons/fa';
import { blockchainAPI } from '../services/api';

function BlockchainExplorer() {
  const [explorerData, setExplorerData] = useState(null);
  const [validationData, setValidationData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChain, setSelectedChain] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [viewType, setViewType] = useState('all'); // 'all', 'department', 'class', 'student'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllData();
  }, [viewType]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [explorerResponse, validationResponse, statsResponse] = await Promise.all([
        blockchainAPI.getExplorer(viewType === 'all' ? undefined : viewType),
        blockchainAPI.validate(),
        blockchainAPI.getStats()
      ]);
      setExplorerData(explorerResponse.data.data);
      setValidationData(validationResponse.data.data);
      setStatsData(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewChainDetails = (chain) => {
    setSelectedChain(chain);
    setSelectedBlock(null);
  };

  const viewBlockDetails = (block) => {
    setSelectedBlock(block);
  };

  const renderOverviewStats = () => {
    if (!statsData || !validationData) return null;

    return (
      <div className="grid grid-3">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <FaDatabase size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{statsData.totalBlocks}</div>
            <div className="stat-label">Total Blocks</div>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <FaShieldAlt size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{validationData.overallValid ? 'Valid' : 'Invalid'}</div>
            <div className="stat-label">Blockchain Status</div>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <FaLink size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{statsData.totalChains}</div>
            <div className="stat-label">Total Chains</div>
          </div>
        </div>
      </div>
    );
  };

  const renderValidationSummary = () => {
    if (!validationData) return null;

    return (
      <div className="card" style={{ marginTop: '1.5rem', background: '#f8f9fa' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaShieldAlt /> Multi-Level Validation Status
        </h3>
        <div className="grid grid-2">
          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>Chain Validation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <ValidationCheck 
                label="Department Chains" 
                valid={validationData.validationChecks?.departmentChainsValid}
                count={`${validationData.departments.valid}/${validationData.departments.valid + validationData.departments.invalid}`}
              />
              <ValidationCheck 
                label="Class Chains" 
                valid={validationData.validationChecks?.classChainsValid}
                count={`${validationData.classes.valid}/${validationData.classes.valid + validationData.classes.invalid}`}
              />
              <ValidationCheck 
                label="Student Chains" 
                valid={validationData.validationChecks?.studentChainsValid}
                count={`${validationData.students.valid}/${validationData.students.valid + validationData.students.invalid}`}
              />
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>Integrity Checks</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <ValidationCheck 
                label="Genesis Links (Class→Dept)" 
                valid={validationData.validationChecks?.classGenesisLinksValid}
              />
              <ValidationCheck 
                label="Genesis Links (Student→Class)" 
                valid={validationData.validationChecks?.studentGenesisLinksValid}
              />
              <ValidationCheck 
                label="Attendance Hashes" 
                valid={validationData.validationChecks?.attendanceHashesValid}
                count={validationData.attendance?.totalRecords > 0 ? `${validationData.attendance.validRecords}/${validationData.attendance.totalRecords}` : '0/0'}
              />
              <ValidationCheck 
                label="Proof of Work" 
                valid={validationData.validationChecks?.powValid}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ValidationCheck = ({ label, valid, count }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'white', borderRadius: '0.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {valid ? (
        <FaCheckCircle style={{ color: 'var(--secondary-color)', flexShrink: 0 }} />
      ) : (
        <FaExclamationTriangle style={{ color: 'var(--danger-color)', flexShrink: 0 }} />
      )}
      <span style={{ flex: 1, fontSize: '0.85rem' }}>{label}</span>
      {count && <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 'bold' }}>{count}</span>}
    </div>
  );

  const renderBlock = (block, index, isInteractive = false) => {
    const isGenesis = index === 0;
    const isValid = block.hash.startsWith('0000');
    const hasAttendance = block.transactions.some(tx => tx.type === 'attendance');
    
    return (
      <div 
        key={index} 
        className={`block-node ${isGenesis ? 'genesis' : ''} ${!isValid ? 'invalid' : ''} ${isInteractive ? 'interactive' : ''}`}
        onClick={() => isInteractive && viewBlockDetails(block)}
        style={{ cursor: isInteractive ? 'pointer' : 'default' }}
      >
        <div className="block-header">
          <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
            {isGenesis ? '🎯 Genesis Block' : `Block #${block.index}`}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {hasAttendance && <span title="Contains Attendance Records">📋</span>}
            {isValid ? (
              <FaCheckCircle style={{ color: 'var(--secondary-color)' }} title="Valid PoW" />
            ) : (
              <FaExclamationTriangle style={{ color: 'var(--danger-color)' }} title="Invalid PoW" />
            )}
          </div>
        </div>
        <div className="block-body">
          <div className="block-field">
            <strong><FaHashtag style={{ fontSize: '0.7rem' }} /> Index:</strong> {block.index}
          </div>
          <div className="block-field">
            <strong><FaClock style={{ fontSize: '0.7rem' }} /> Timestamp:</strong><br />
            {new Date(block.timestamp).toLocaleString()}
          </div>
          <div className="block-field">
            <strong>📝 Transactions:</strong> {block.transactions.length}
            {hasAttendance && <span style={{ fontSize: '0.7rem', color: 'var(--primary-color)' }}> (Attendance)</span>}
          </div>
          <div className="block-field">
            <strong>⬅️ Prev Hash:</strong><br />
            <code style={{ fontSize: '0.65rem' }}>{block.prevHash.substring(0, 16)}...{block.prevHash.substring(block.prevHash.length - 8)}</code>
          </div>
          <div className="block-field">
            <strong>🔢 Nonce:</strong> {block.nonce.toLocaleString()}
          </div>
          <div className="block-field">
            <strong>🔐 Hash:</strong><br />
            <code style={{ 
              fontSize: '0.65rem', 
              color: isValid ? 'var(--secondary-color)' : 'var(--danger-color)',
              fontWeight: 'bold'
            }}>
              {block.hash.substring(0, 16)}...{block.hash.substring(block.hash.length - 8)}
            </code>
          </div>
          <div className="block-field">
            <strong>⚡ PoW:</strong> {isValid ? '✅ Valid (0000...)' : '❌ Invalid'}
          </div>
        </div>
        {isInteractive && (
          <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.05)', borderRadius: '0.25rem', textAlign: 'center', fontSize: '0.75rem' }}>
            Click to view full details
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Loading blockchain data...</p>
      </div>
    );
  }

  // Filter chains based on search term
  const filterChains = (chains) => {
    if (!searchTerm) return chains;
    return chains.filter(chain => 
      JSON.stringify(chain).toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaCube /> Blockchain Explorer
          </h1>
          <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
            <button 
              className={`btn btn-sm ${viewType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewType('all')}
            >
              📊 All Chains
            </button>
            <button 
              className={`btn btn-sm ${viewType === 'department' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewType('department')}
            >
              🏢 Departments
            </button>
            <button 
              className={`btn btn-sm ${viewType === 'class' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewType('class')}
            >
              🎓 Classes
            </button>
            <button 
              className={`btn btn-sm ${viewType === 'student' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewType('student')}
            >
              👨‍🎓 Students
            </button>
          </div>
        </div>

        {/* Overview Statistics */}
        {renderOverviewStats()}

        {/* Validation Summary */}
        {renderValidationSummary()}

        {!selectedChain && !selectedBlock ? (
          <div>
            {/* Search Bar */}
            <div style={{ margin: '1.5rem 0' }}>
              <div style={{ position: 'relative', maxWidth: '500px' }}>
                <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search chains by ID, name, or hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Department Chains */}
            {(viewType === 'all' || viewType === 'department') && explorerData?.departments && (
              <div style={{ marginTop: '1.5rem' }}>
                <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🏢 Department Blockchains
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 'normal' }}>
                    ({filterChains(explorerData.departments).length} chains)
                  </span>
                </h2>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Blocks</th>
                        <th>Latest Hash</th>
                        <th>Genesis Hash</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterChains(explorerData.departments).map((chain) => (
                        <tr key={chain.id}>
                          <td><code style={{ fontSize: '0.75rem' }}>{chain.id}</code></td>
                          <td><strong>{chain.metadata.name}</strong></td>
                          <td><span className="badge" style={{ background: 'var(--primary-color)' }}>{chain.metadata.code}</span></td>
                          <td><strong>{chain.stats.length}</strong></td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.7rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {chain.stats.latestHash.substring(0, 16)}...
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                            0 (Genesis)
                          </td>
                          <td>
                            {chain.stats.isValid ? (
                              <span className="badge badge-success"><FaCheckCircle /> Valid</span>
                            ) : (
                              <span className="badge badge-danger"><FaExclamationTriangle /> Invalid</span>
                            )}
                          </td>
                          <td>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => viewChainDetails(chain)}
                            >
                              <FaCube /> View Chain
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Class Chains */}
            {(viewType === 'all' || viewType === 'class') && explorerData?.classes && (
              <div style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🎓 Class Blockchains
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 'normal' }}>
                    ({filterChains(explorerData.classes).length} chains)
                  </span>
                </h2>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Section</th>
                        <th>Department</th>
                        <th>Blocks</th>
                        <th>Latest Hash</th>
                        <th>Parent Link</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterChains(explorerData.classes).slice(0, 20).map((chain) => (
                        <tr key={chain.id}>
                          <td><code style={{ fontSize: '0.7rem' }}>{chain.id}</code></td>
                          <td><strong>{chain.metadata.name}</strong></td>
                          <td><span className="badge badge-primary">{chain.metadata.section}</span></td>
                          <td><code style={{ fontSize: '0.7rem' }}>{chain.metadata.departmentId}</code></td>
                          <td><strong>{chain.stats.length}</strong></td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.7rem', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {chain.stats.latestHash.substring(0, 16)}...
                          </td>
                          <td>
                            <span className="badge" style={{ background: 'var(--secondary-color)', fontSize: '0.7rem' }}>
                              <FaLink /> Dept
                            </span>
                          </td>
                          <td>
                            {chain.stats.isValid ? (
                              <span className="badge badge-success"><FaCheckCircle /> Valid</span>
                            ) : (
                              <span className="badge badge-danger"><FaExclamationTriangle /> Invalid</span>
                            )}
                          </td>
                          <td>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => viewChainDetails(chain)}
                            >
                              <FaCube /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filterChains(explorerData.classes).length > 20 && (
                    <p className="text-center mt-2" style={{ color: 'var(--text-light)' }}>
                      Showing 20 of {filterChains(explorerData.classes).length} class chains
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Student Chains */}
            {(viewType === 'all' || viewType === 'student') && explorerData?.students && (
              <div style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  👨‍🎓 Student Blockchains
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 'normal' }}>
                    ({filterChains(explorerData.students).length} chains)
                  </span>
                </h2>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Roll Number</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Class</th>
                        <th>Blocks</th>
                        <th>Latest Hash</th>
                        <th>Parent Link</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterChains(explorerData.students).slice(0, 20).map((chain) => (
                        <tr key={chain.id}>
                          <td><span className="badge" style={{ background: 'var(--primary-color)' }}>{chain.metadata.rollNumber}</span></td>
                          <td><strong>{chain.metadata.name}</strong></td>
                          <td style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{chain.metadata.email}</td>
                          <td><code style={{ fontSize: '0.7rem' }}>{chain.metadata.classId}</code></td>
                          <td><strong>{chain.stats.length}</strong></td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.7rem', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {chain.stats.latestHash.substring(0, 16)}...
                          </td>
                          <td>
                            <span className="badge" style={{ background: 'var(--secondary-color)', fontSize: '0.7rem' }}>
                              <FaLink /> Class
                            </span>
                          </td>
                          <td>
                            {chain.stats.isValid ? (
                              <span className="badge badge-success"><FaCheckCircle /> Valid</span>
                            ) : (
                              <span className="badge badge-danger"><FaExclamationTriangle /> Invalid</span>
                            )}
                          </td>
                          <td>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => viewChainDetails(chain)}
                            >
                              <FaCube /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filterChains(explorerData.students).length > 20 && (
                    <p className="text-center mt-2" style={{ color: 'var(--text-light)' }}>
                      Showing 20 of {filterChains(explorerData.students).length} student chains
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : selectedBlock ? (
          // Block Detail View
          <div>
            <button 
              className="btn btn-secondary mb-2"
              onClick={() => setSelectedBlock(null)}
            >
              ← Back to Chain
            </button>
            
            <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FaCube /> Block #{selectedBlock.index} Details
              </h2>
              
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}>Block Information</h3>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p><strong>Index:</strong> {selectedBlock.index}</p>
                    <p><strong>Timestamp:</strong> {new Date(selectedBlock.timestamp).toLocaleString()}</p>
                    <p><strong>Nonce:</strong> {selectedBlock.nonce.toLocaleString()}</p>
                    <p><strong>Transactions:</strong> {selectedBlock.transactions.length}</p>
                    <p><strong>PoW Valid:</strong> {selectedBlock.hash.startsWith('0000') ? '✅ Yes (starts with 0000)' : '❌ No'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}>Hash Information</h3>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p><strong>Previous Hash:</strong></p>
                    <code style={{ 
                      display: 'block', 
                      padding: '0.5rem', 
                      background: 'rgba(0,0,0,0.3)', 
                      borderRadius: '0.25rem',
                      wordBreak: 'break-all',
                      fontSize: '0.75rem',
                      marginBottom: '0.5rem'
                    }}>
                      {selectedBlock.prevHash}
                    </code>
                    <p><strong>Current Hash:</strong></p>
                    <code style={{ 
                      display: 'block', 
                      padding: '0.5rem', 
                      background: 'rgba(0,0,0,0.3)', 
                      borderRadius: '0.25rem',
                      wordBreak: 'break-all',
                      fontSize: '0.75rem',
                      color: selectedBlock.hash.startsWith('0000') ? '#4ade80' : '#f87171'
                    }}>
                      {selectedBlock.hash}
                    </code>
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}>Transactions ({selectedBlock.transactions.length})</h3>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {selectedBlock.transactions.map((tx, idx) => (
                    <div key={idx} style={{ 
                      padding: '0.75rem', 
                      background: 'rgba(0,0,0,0.2)', 
                      borderRadius: '0.25rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.85rem'
                    }}>
                      <p><strong>Type:</strong> <span className="badge" style={{ background: tx.type === 'attendance' ? 'var(--secondary-color)' : 'var(--primary-color)' }}>{tx.type}</span></p>
                      {tx.type === 'attendance' && (
                        <>
                          <p><strong>Student:</strong> {tx.studentName} ({tx.rollNumber})</p>
                          <p><strong>Status:</strong> <span className="badge badge-success">{tx.status}</span></p>
                          <p><strong>Date:</strong> {tx.date}</p>
                        </>
                      )}
                      {tx.type === 'genesis' && (
                        <p><strong>Chain Type:</strong> {tx.chainType}</p>
                      )}
                      <p><strong>Timestamp:</strong> {new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button 
              className="btn btn-secondary mb-2"
              onClick={() => setSelectedChain(null)}
            >
              ← Back to List
            </button>
            
            {/* Chain Header */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '2rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FaDatabase /> {selectedChain.type.toUpperCase()} Blockchain
              </h2>
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.3rem' }}>Chain ID</p>
                  <code style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.25rem', display: 'block' }}>
                    {selectedChain.id}
                  </code>
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.3rem' }}>Chain Type</p>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                    {selectedChain.type}
                  </span>
                </div>
              </div>
              
              {selectedChain.metadata && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Metadata</h3>
                  {selectedChain.metadata.name && <p><strong>Name:</strong> {selectedChain.metadata.name}</p>}
                  {selectedChain.metadata.code && <p><strong>Code:</strong> {selectedChain.metadata.code}</p>}
                  {selectedChain.metadata.section && <p><strong>Section:</strong> {selectedChain.metadata.section}</p>}
                  {selectedChain.metadata.rollNumber && <p><strong>Roll Number:</strong> {selectedChain.metadata.rollNumber}</p>}
                  {selectedChain.metadata.email && <p><strong>Email:</strong> {selectedChain.metadata.email}</p>}
                  {selectedChain.metadata.departmentId && <p><strong>Department ID:</strong> {selectedChain.metadata.departmentId}</p>}
                  {selectedChain.metadata.classId && <p><strong>Class ID:</strong> {selectedChain.metadata.classId}</p>}
                </div>
              )}
            </div>

            {/* Chain Statistics Cards */}
            <div className="grid grid-4" style={{ gap: '1rem', marginBottom: '2rem' }}>
              <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <FaCube style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>{selectedChain.stats.length}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Blocks</p>
              </div>
              
              <div className="card" style={{ textAlign: 'center', background: selectedChain.stats.isValid ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                <FaShieldAlt style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>
                  {selectedChain.stats.isValid ? 'Valid' : 'Invalid'}
                </h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Chain Status</p>
              </div>
              
              <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333' }}>
                <FaHashtag style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                <h3 style={{ fontSize: '1rem', margin: '0.5rem 0', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                  {selectedChain.stats.latestHash.substring(0, 12)}...
                </h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Latest Hash</p>
              </div>
              
              <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', color: '#333' }}>
                <FaClock style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                <h3 style={{ fontSize: '1rem', margin: '0.5rem 0' }}>
                  {selectedChain.blocks.length > 0 ? new Date(selectedChain.blocks[selectedChain.blocks.length - 1].timestamp).toLocaleDateString() : 'N/A'}
                </h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Last Updated</p>
              </div>
            </div>

            {/* Genesis Block Details */}
            {selectedChain.blocks.length > 0 && (
              <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <FaCube /> Genesis Block
                </h3>
                <div className="grid grid-2" style={{ gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Previous Hash (should be "0")</p>
                    <code style={{ display: 'block', background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.25rem', wordBreak: 'break-all', fontSize: '0.8rem' }}>
                      {selectedChain.blocks[0].prevHash}
                    </code>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Genesis Hash</p>
                    <code style={{ display: 'block', background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.25rem', wordBreak: 'break-all', fontSize: '0.8rem' }}>
                      {selectedChain.blocks[0].hash}
                    </code>
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Timestamp</p>
                  <p><strong>{new Date(selectedChain.blocks[0].timestamp).toLocaleString()}</strong></p>
                </div>
              </div>
            )}

            {/* Blockchain Visualization */}
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaLink /> Blockchain Visualization
            </h3>
            <div style={{ 
              background: 'var(--light-bg)', 
              padding: '2rem', 
              borderRadius: '0.5rem',
              overflowX: 'auto',
              marginBottom: '2rem'
            }}>
              <div className="blockchain-chain">
                {selectedChain.blocks.map((block, index) => (
                  <React.Fragment key={index}>
                    {renderBlock(block, index, true)}
                    {index < selectedChain.blocks.length - 1 && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: 'var(--primary-color)',
                        fontSize: '2rem',
                        padding: '0 0.5rem'
                      }}>
                        <FaChevronRight />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Block List Table */}
            <h3 style={{ marginBottom: '1rem' }}>Block Details</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Hash</th>
                    <th>Previous Hash</th>
                    <th>Timestamp</th>
                    <th>Transactions</th>
                    <th>Nonce</th>
                    <th>PoW Valid</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedChain.blocks.map((block, index) => (
                    <tr key={index} onClick={() => setSelectedBlock(block)} style={{ cursor: 'pointer' }}>
                      <td>
                        <span className={`badge ${index === 0 ? 'badge-primary' : ''}`}>
                          {index} {index === 0 ? '(Genesis)' : ''}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {block.hash.substring(0, 20)}...
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {block.prevHash.substring(0, 20)}...
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>
                        {new Date(block.timestamp).toLocaleString()}
                      </td>
                      <td>
                        <span className="badge">{block.transactions.length}</span>
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>
                        {block.nonce.toLocaleString()}
                      </td>
                      <td>
                        {block.hash.startsWith('0000') ? (
                          <span className="badge badge-success"><FaCheckCircle /> Yes</span>
                        ) : (
                          <span className="badge badge-danger"><FaExclamationTriangle /> No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlockchainExplorer;
