const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const departmentRoutes = require('./routes/departmentRoutes');
const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/departments', departmentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Blockchain Attendance Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Blockchain-Based Attendance Management System',
    version: '1.0.0',
    endpoints: {
      departments: '/api/departments',
      classes: '/api/classes',
      students: '/api/students',
      attendance: '/api/attendance',
      blockchain: '/api/blockchain',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║   Blockchain-Based Attendance Management System (BAMS)       ║
║   Server running on port ${PORT}                                 ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║                                                               ║
║   API Documentation:                                          ║
║   - Departments: http://localhost:${PORT}/api/departments         ║
║   - Classes:     http://localhost:${PORT}/api/classes             ║
║   - Students:    http://localhost:${PORT}/api/students            ║
║   - Attendance:  http://localhost:${PORT}/api/attendance          ║
║   - Blockchain:  http://localhost:${PORT}/api/blockchain          ║
║   - Health:      http://localhost:${PORT}/api/health              ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
