const Blockchain = require('./Blockchain');

class BlockchainManager {
  constructor() {
    // Store all department chains
    this.departmentChains = new Map();
    
    // Store class chains: key = classId, value = blockchain
    this.classChains = new Map();
    
    // Store student chains: key = studentId, value = blockchain
    this.studentChains = new Map();
    
    // Initialize with default structure
    this.initializeDefaultStructure();
  }

  /**
   * Initialize default departments and classes
   */
  initializeDefaultStructure() {
    // Create two departments as per requirements
    const departments = [
      { id: 'dept-1', name: 'School of Computing', code: 'SOC' },
      { id: 'dept-2', name: 'School of Software Engineering', code: 'SSE' }
    ];

    departments.forEach(dept => {
      this.createDepartment(dept);
      
      // Create 5 classes per department as per requirements
      for (let i = 1; i <= 5; i++) {
        const classData = {
          id: `${dept.id}-class-${i}`,
          name: `Class ${i}`,
          departmentId: dept.id,
          semester: i,
          section: String.fromCharCode(64 + i) // A, B, C, D, E
        };
        
        this.createClass(classData);
        
        // Create 35 students per class as per requirements
        for (let j = 1; j <= 35; j++) {
          const studentData = {
            id: `${classData.id}-student-${j}`,
            name: `Student ${j}`,
            rollNumber: `${dept.code}-${i}-${j.toString().padStart(3, '0')}`,
            departmentId: dept.id,
            classId: classData.id,
            email: `student${j}@${dept.code.toLowerCase()}.edu`
          };
          
          this.createStudent(studentData);
        }
      }
    });
  }

  /**
   * DEPARTMENT OPERATIONS
   */
  createDepartment(deptData) {
    const blockchain = new Blockchain('department', null, deptData);
    this.departmentChains.set(deptData.id, blockchain);
    return blockchain;
  }

  getDepartment(deptId) {
    return this.departmentChains.get(deptId);
  }

  getAllDepartments() {
    const departments = [];
    this.departmentChains.forEach((chain, id) => {
      const state = chain.getLatestState();
      if (!state.deleted) {
        departments.push({
          id,
          ...state,
          chainStats: chain.getChainStats()
        });
      }
    });
    return departments;
  }

  updateDepartment(deptId, updates) {
    const chain = this.departmentChains.get(deptId);
    if (!chain) throw new Error('Department not found');
    
    const transaction = {
      type: 'update',
      updates,
      timestamp: Date.now()
    };
    
    chain.addBlock([transaction]);
    return chain;
  }

  deleteDepartment(deptId) {
    const chain = this.departmentChains.get(deptId);
    if (!chain) throw new Error('Department not found');
    
    const transaction = {
      type: 'delete',
      status: 'deleted',
      timestamp: Date.now()
    };
    
    chain.addBlock([transaction]);
    return chain;
  }

  searchDepartments(query) {
    const allDepts = this.getAllDepartments();
    return allDepts.filter(dept => 
      dept.name.toLowerCase().includes(query.toLowerCase()) ||
      dept.code.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * CLASS OPERATIONS
   */
  createClass(classData) {
    const deptChain = this.departmentChains.get(classData.departmentId);
    if (!deptChain) throw new Error('Department not found');
    
    // Class genesis block uses department's latest hash as prevHash
    const parentHash = deptChain.getLatestBlock().hash;
    const blockchain = new Blockchain('class', parentHash, classData);
    
    this.classChains.set(classData.id, blockchain);
    return blockchain;
  }

  getClass(classId) {
    return this.classChains.get(classId);
  }

  getAllClasses(departmentId = null) {
    const classes = [];
    this.classChains.forEach((chain, id) => {
      const state = chain.getLatestState();
      if (!state.deleted) {
        if (!departmentId || state.departmentId === departmentId) {
          classes.push({
            id,
            ...state,
            chainStats: chain.getChainStats()
          });
        }
      }
    });
    return classes;
  }

  updateClass(classId, updates) {
    const chain = this.classChains.get(classId);
    if (!chain) throw new Error('Class not found');
    
    const transaction = {
      type: 'update',
      updates,
      timestamp: Date.now()
    };
    
    chain.addBlock([transaction]);
    return chain;
  }

  deleteClass(classId) {
    const chain = this.classChains.get(classId);
    if (!chain) throw new Error('Class not found');
    
    const transaction = {
      type: 'delete',
      status: 'deleted',
      timestamp: Date.now()
    };
    
    chain.addBlock([transaction]);
    return chain;
  }

  searchClasses(query, departmentId = null) {
    const allClasses = this.getAllClasses(departmentId);
    return allClasses.filter(cls => 
      cls.name.toLowerCase().includes(query.toLowerCase()) ||
      cls.section.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * STUDENT OPERATIONS
   */
  createStudent(studentData) {
    const classChain = this.classChains.get(studentData.classId);
    if (!classChain) throw new Error('Class not found');
    
    // Student genesis block uses class's latest hash as prevHash
    const parentHash = classChain.getLatestBlock().hash;
    const blockchain = new Blockchain('student', parentHash, studentData);
    
    this.studentChains.set(studentData.id, blockchain);
    return blockchain;
  }

  getStudent(studentId) {
    return this.studentChains.get(studentId);
  }

  getAllStudents(classId = null, departmentId = null) {
    const students = [];
    this.studentChains.forEach((chain, id) => {
      const state = chain.getLatestState();
      if (!state.deleted) {
        if ((!classId || state.classId === classId) && 
            (!departmentId || state.departmentId === departmentId)) {
          students.push({
            id,
            ...state,
            chainStats: chain.getChainStats()
          });
        }
      }
    });
    return students;
  }

  updateStudent(studentId, updates) {
    const chain = this.studentChains.get(studentId);
    if (!chain) throw new Error('Student not found');
    
    const transaction = {
      type: 'update',
      updates,
      timestamp: Date.now()
    };
    
    chain.addBlock([transaction]);
    return chain;
  }

  deleteStudent(studentId) {
    const chain = this.studentChains.get(studentId);
    if (!chain) throw new Error('Student not found');
    
    const transaction = {
      type: 'delete',
      status: 'deleted',
      timestamp: Date.now()
    };
    
    chain.addBlock([transaction]);
    return chain;
  }

  searchStudents(query, classId = null, departmentId = null) {
    const allStudents = this.getAllStudents(classId, departmentId);
    return allStudents.filter(student => 
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(query.toLowerCase()) ||
      student.email.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * ATTENDANCE OPERATIONS
   */
  markAttendance(studentId, status) {
    const chain = this.studentChains.get(studentId);
    if (!chain) throw new Error('Student not found');
    
    const studentData = chain.getLatestState();
    
    const transaction = {
      type: 'attendance',
      studentId,
      studentName: studentData.name,
      rollNumber: studentData.rollNumber,
      departmentId: studentData.departmentId,
      classId: studentData.classId,
      status, // 'present', 'absent', 'leave'
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    
    chain.addBlock([transaction]);
    return transaction;
  }

  getStudentAttendance(studentId) {
    const chain = this.studentChains.get(studentId);
    if (!chain) throw new Error('Student not found');
    
    const attendanceRecords = [];
    const blocks = chain.getAllBlocks();
    
    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];
      for (const tx of block.transactions) {
        if (tx.type === 'attendance') {
          attendanceRecords.push({
            ...tx,
            blockIndex: block.index,
            blockHash: block.hash
          });
        }
      }
    }
    
    return attendanceRecords;
  }

  getTodayAttendance(classId = null, departmentId = null) {
    const today = new Date().toISOString().split('T')[0];
    const allStudents = this.getAllStudents(classId, departmentId);
    const attendance = [];
    
    allStudents.forEach(student => {
      const records = this.getStudentAttendance(student.id);
      const todayRecord = records.find(r => r.date === today);
      
      attendance.push({
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        classId: student.classId,
        departmentId: student.departmentId,
        status: todayRecord ? todayRecord.status : 'unmarked',
        timestamp: todayRecord ? todayRecord.timestamp : null
      });
    });
    
    return attendance;
  }

  /**
   * VALIDATION OPERATIONS
   */
  validateAllChains() {
    const results = {
      departments: { valid: 0, invalid: 0, details: [] },
      classes: { valid: 0, invalid: 0, details: [] },
      students: { valid: 0, invalid: 0, details: [] },
      attendance: { totalRecords: 0, validRecords: 0, invalidRecords: 0 },
      overallValid: true,
      validationChecks: {
        departmentChainsValid: true,
        classChainsValid: true,
        classGenesisLinksValid: true,
        studentChainsValid: true,
        studentGenesisLinksValid: true,
        attendanceHashesValid: true,
        powValid: true
      }
    };

    // Track invalid parent chains for cascade validation
    const invalidDepartments = new Set();
    const invalidClasses = new Set();

    // 1. VALIDATE DEPARTMENT CHAINS
    this.departmentChains.forEach((chain, id) => {
      const isValid = chain.isValid();
      if (isValid) {
        results.departments.valid++;
      } else {
        results.departments.invalid++;
        results.overallValid = false;
        results.validationChecks.departmentChainsValid = false;
        invalidDepartments.add(id);
      }
      results.departments.details.push({ id, isValid });
    });

    // 2. VALIDATE CLASS CHAINS & 3. CHECK CLASS GENESIS LINKS TO DEPARTMENT
    this.classChains.forEach((chain, id) => {
      const chainValid = chain.isValid();
      const state = chain.getLatestState();
      
      // Check if parent department is valid
      const parentDeptValid = !invalidDepartments.has(state.departmentId);
      
      // Check if genesis block's prevHash matches parent department
      const deptChain = this.departmentChains.get(state.departmentId);
      const genesisBlock = chain.getAllBlocks()[0];
      const genesisLinkValid = deptChain && 
        this.isDepartmentHashInChain(deptChain, genesisBlock.prevHash);
      
      // If parent department is invalid, this chain is also invalid (cascade)
      const fullValid = chainValid && genesisLinkValid && parentDeptValid;
      
      if (fullValid) {
        results.classes.valid++;
      } else {
        results.classes.invalid++;
        results.overallValid = false;
        invalidClasses.add(id);
        
        if (!chainValid) results.validationChecks.classChainsValid = false;
        if (!genesisLinkValid) results.validationChecks.classGenesisLinksValid = false;
      }
      
      results.classes.details.push({ 
        id, 
        isValid: fullValid, 
        chainValid, 
        genesisLinkValid,
        parentDeptValid,
        reason: !fullValid ? 
          (!parentDeptValid ? 'Parent department invalid' : 
           !chainValid ? 'Chain validation failed' : 
           !genesisLinkValid ? 'Genesis link to department invalid' : '') : ''
      });
    });

    // 4. VALIDATE STUDENT CHAINS & 5. CHECK STUDENT GENESIS LINKS TO CLASS & 6. VALIDATE ATTENDANCE RECORDS
    this.studentChains.forEach((chain, id) => {
      const chainValid = chain.isValid();
      const state = chain.getLatestState();
      
      // Check if parent class is valid
      const parentClassValid = !invalidClasses.has(state.classId);
      
      // Check if genesis block's prevHash matches parent class
      const classChain = this.classChains.get(state.classId);
      const genesisBlock = chain.getAllBlocks()[0];
      const genesisLinkValid = classChain && 
        this.isClassHashInChain(classChain, genesisBlock.prevHash);
      
      // Validate attendance record hashes (requirement 6)
      let attendanceHashValid = true;
      let attendanceCount = 0;
      const blocks = chain.getAllBlocks();
      
      for (let i = 1; i < blocks.length; i++) {
        const block = blocks[i];
        
        // Re-hash each block to verify integrity
        const recalculatedHash = block.calculateHash();
        if (block.hash !== recalculatedHash) {
          attendanceHashValid = false;
          results.validationChecks.attendanceHashesValid = false;
        }
        
        // Count attendance transactions
        for (const tx of block.transactions) {
          if (tx.type === 'attendance') {
            attendanceCount++;
            results.attendance.totalRecords++;
            
            if (block.hash === recalculatedHash) {
              results.attendance.validRecords++;
            } else {
              results.attendance.invalidRecords++;
            }
          }
        }
        
        // Verify PoW for attendance blocks (requirement 7)
        if (!block.hash.startsWith('0000')) {
          attendanceHashValid = false;
          results.validationChecks.powValid = false;
        }
      }
      
      // If parent class is invalid, this chain is also invalid (cascade)
      const fullValid = chainValid && genesisLinkValid && attendanceHashValid && parentClassValid;
      
      if (fullValid) {
        results.students.valid++;
      } else {
        results.students.invalid++;
        results.overallValid = false;
        
        if (!chainValid) results.validationChecks.studentChainsValid = false;
        if (!genesisLinkValid) results.validationChecks.studentGenesisLinksValid = false;
      }
      
      results.students.details.push({ 
        id, 
        isValid: fullValid, 
        chainValid,
        genesisLinkValid,
        attendanceHashValid,
        attendanceCount,
        parentClassValid,
        reason: !fullValid ? 
          (!parentClassValid ? 'Parent class invalid' : 
           !chainValid ? 'Chain validation failed' : 
           !genesisLinkValid ? 'Genesis link to class invalid' : 
           !attendanceHashValid ? 'Attendance hash validation failed' : '') : ''
      });
    });

    return results;
  }

  isDepartmentHashInChain(deptChain, hash) {
    const blocks = deptChain.getAllBlocks();
    return blocks.some(block => block.hash === hash);
  }

  isClassHashInChain(classChain, hash) {
    const blocks = classChain.getAllBlocks();
    return blocks.some(block => block.hash === hash);
  }

  /**
   * Get blockchain explorer data
   */
  getBlockchainExplorer() {
    return {
      departments: this.getDepartmentExplorerData(),
      classes: this.getClassExplorerData(),
      students: this.getStudentExplorerData()
    };
  }

  getDepartmentExplorerData() {
    const data = [];
    this.departmentChains.forEach((chain, id) => {
      data.push({
        id,
        type: 'department',
        metadata: chain.metadata,
        blocks: chain.getAllBlocks(),
        stats: chain.getChainStats()
      });
    });
    return data;
  }

  getClassExplorerData() {
    const data = [];
    this.classChains.forEach((chain, id) => {
      data.push({
        id,
        type: 'class',
        metadata: chain.metadata,
        blocks: chain.getAllBlocks(),
        stats: chain.getChainStats()
      });
    });
    return data;
  }

  getStudentExplorerData() {
    const data = [];
    this.studentChains.forEach((chain, id) => {
      data.push({
        id,
        type: 'student',
        metadata: chain.metadata,
        blocks: chain.getAllBlocks(),
        stats: chain.getChainStats()
      });
    });
    return data;
  }

  /**
   * Get system statistics
   */
  getSystemStats() {
    return {
      totalDepartments: this.departmentChains.size,
      activeDepartments: this.getAllDepartments().length,
      totalClasses: this.classChains.size,
      activeClasses: this.getAllClasses().length,
      totalStudents: this.studentChains.size,
      activeStudents: this.getAllStudents().length,
      totalBlocks: this.getTotalBlocks(),
      validationStatus: this.validateAllChains()
    };
  }

  getTotalBlocks() {
    let total = 0;
    
    this.departmentChains.forEach(chain => {
      total += chain.getAllBlocks().length;
    });
    
    this.classChains.forEach(chain => {
      total += chain.getAllBlocks().length;
    });
    
    this.studentChains.forEach(chain => {
      total += chain.getAllBlocks().length;
    });
    
    return total;
  }
}

// Singleton instance
const blockchainManager = new BlockchainManager();

module.exports = blockchainManager;
