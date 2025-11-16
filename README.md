# Blockchain-Based Attendance Management System (BAMS)

![Project Banner](https://img.shields.io/badge/Blockchain-Attendance-blue)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Blockchain Structure](#blockchain-structure)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

The **Blockchain-Based Attendance Management System (BAMS)** is an advanced multi-layered blockchain application designed to manage attendance records for educational institutions using a custom-built blockchain implementation. Unlike traditional single-chain systems, BAMS implements a **3-tier hierarchical blockchain architecture** ensuring data integrity, immutability, and complete transparency.

### Key Highlights
- ✅ **3-Layer Blockchain Hierarchy**: Department → Class → Student → Attendance
- ✅ **Custom SHA-256 Hashing**: No external blockchain libraries
- ✅ **Proof of Work (PoW)**: Mining with difficulty target '0000'
- ✅ **Full CRUD Operations**: Create, Read, Update (append-only), Delete (soft delete)
- ✅ **Multi-Level Validation**: Validates entire chain hierarchy
- ✅ **Real-time Blockchain Explorer**: Visualize all blocks and transactions
- ✅ **RESTful API**: Complete backend API for all operations

## ✨ Features

### Core Functionality
1. **Department Management**
   - Create, update, view, and search departments
   - Each department has its own independent blockchain
   - Soft delete using blockchain append-only structure

2. **Class Management**
   - Manage classes within departments
   - Class blockchain extends from parent department chain
   - Support for multiple semesters and sections

3. **Student Management**
   - Complete student CRUD operations
   - Personal blockchain ledger for each student
   - Student chain extends from parent class chain
   - Searchable by name, roll number, or email

4. **Attendance System**
   - Mark attendance (Present/Absent/Leave)
   - Bulk attendance marking
   - View today's attendance
   - Complete attendance history per student
   - Statistical analysis (percentage, totals)

5. **Blockchain Explorer**
   - Visualize complete blockchain structure
   - View individual blocks and transactions
   - Real-time validation status
   - Block-level details (hash, nonce, timestamp, transactions)

## 🏗 System Architecture

### 3-Layer Hierarchical Blockchain

```
Department Blockchain (Layer 1)
    ├─ Genesis Block (prevHash: '0')
    └─ Blocks (metadata, updates, deletes)
         │
         ├─→ Class Blockchain (Layer 2)
         │    ├─ Genesis Block (prevHash: Department's latest hash)
         │    └─ Blocks (metadata, updates, deletes)
         │         │
         │         ├─→ Student Blockchain (Layer 3)
         │         │    ├─ Genesis Block (prevHash: Class's latest hash)
         │         │    └─ Blocks (attendance records)
         │         │
         │         └─→ Student Blockchain (Layer 3)
         │              └─ ...
         │
         └─→ Class Blockchain (Layer 2)
              └─ ...
```

### Data Flow
1. **Department Creation** → Creates independent blockchain
2. **Class Creation** → Links genesis block to department's latest hash
3. **Student Creation** → Links genesis block to class's latest hash
4. **Attendance Recording** → Appends block to student's blockchain

## 🛠 Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Crypto (Node.js)**: SHA-256 hashing
- **CORS**: Cross-origin resource sharing
- **Body-Parser**: Request parsing

### Frontend
- **React**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **React Icons**: Icon library
- **Vite**: Build tool and dev server

### Blockchain
- **Custom Implementation**: No external blockchain libraries
- **SHA-256**: Cryptographic hashing
- **Proof of Work**: Mining with difficulty target
- **Immutable Ledger**: Append-only data structure

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend will run on `http://localhost:3000`

## 🚀 Usage

### Starting the Application

1. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application**: Open browser and navigate to `http://localhost:3000`

### Initial Setup
The system automatically initializes with:
- 2 Departments (School of Computing, School of Software Engineering)
- 5 Classes per department
- 35 Students per class

You can add, modify, or remove these through the UI.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Departments
```http
GET    /api/departments              # Get all departments
GET    /api/departments/:id          # Get single department
POST   /api/departments              # Create department
PUT    /api/departments/:id          # Update department
DELETE /api/departments/:id          # Delete department
GET    /api/departments/search?query=  # Search departments
```

#### Classes
```http
GET    /api/classes?departmentId=    # Get all classes (filtered)
GET    /api/classes/:id              # Get single class
POST   /api/classes                  # Create class
PUT    /api/classes/:id              # Update class
DELETE /api/classes/:id              # Delete class
GET    /api/classes/search?query=    # Search classes
```

#### Students
```http
GET    /api/students?classId=&departmentId=  # Get all students (filtered)
GET    /api/students/:id                     # Get single student
GET    /api/students/:id/ledger              # Get student's blockchain ledger
POST   /api/students                         # Create student
PUT    /api/students/:id                     # Update student
DELETE /api/students/:id                     # Delete student
GET    /api/students/search?query=           # Search students
```

#### Attendance
```http
POST   /api/attendance/mark                          # Mark single attendance
POST   /api/attendance/mark-bulk                     # Mark bulk attendance
GET    /api/attendance/today?classId=&departmentId=  # Get today's attendance
GET    /api/attendance/student/:studentId            # Get student attendance
GET    /api/attendance/class/:classId/summary        # Get class summary
GET    /api/attendance/department/:departmentId/summary  # Get dept summary
```

#### Blockchain
```http
GET    /api/blockchain/validate              # Validate all chains
GET    /api/blockchain/explorer?type=        # Get blockchain explorer data
GET    /api/blockchain/stats                 # Get system statistics
GET    /api/blockchain/:type/:id             # Get specific blockchain
GET    /api/blockchain/:type/:id/block/:index  # Get specific block
```

### Request Examples

#### Create Department
```json
POST /api/departments
{
  "id": "dept-3",
  "name": "School of Engineering",
  "code": "SOE"
}
```

#### Mark Attendance
```json
POST /api/attendance/mark
{
  "studentId": "student-123",
  "status": "present"
}
```

## 🔗 Blockchain Structure

### Block Structure
```javascript
{
  index: Number,           // Block number
  timestamp: Number,       // Creation time
  transactions: Array,     // Attendance/metadata
  prevHash: String,        // Previous block hash
  nonce: Number,          // Proof of Work nonce
  hash: String            // SHA-256 hash
}
```

### Transaction Structure (Attendance)
```javascript
{
  type: "attendance",
  studentId: String,
  studentName: String,
  rollNumber: String,
  departmentId: String,
  classId: String,
  status: String,         // "present", "absent", "leave"
  timestamp: Number,
  date: String
}
```

### Hashing Algorithm
```javascript
hash = SHA256(timestamp + JSON.stringify(transactions) + prevHash + nonce)
```

### Proof of Work
- **Difficulty**: 4 (hash must start with "0000")
- **Mining**: Incrementally increase nonce until condition met
- **Validation**: Check if hash starts with "0000"

## 📸 Screenshots

### Dashboard
![Dashboard showing system statistics and blockchain validation status]

### Departments Management
![Department management interface with CRUD operations]

### Attendance Marking
![Attendance marking interface with student list]

### Blockchain Explorer
![Blockchain visualization showing blocks and connections]

### Student Ledger
![Individual student blockchain ledger with attendance history]

## 🌐 Deployment

### Backend Deployment (Render/Railway)

1. Create account on Render.com or Railway.app
2. Connect your GitHub repository
3. Configure environment variables:
   ```
   PORT=5000
   NODE_ENV=production
   ```
4. Deploy from main branch

### Frontend Deployment (Vercel/Netlify)

1. Create account on Vercel or Netlify
2. Connect your GitHub repository
3. Configure build settings:
   ```
   Build command: npm run build
   Output directory: dist
   ```
4. Set environment variable:
   ```
   VITE_API_URL=<your-backend-url>
   ```
5. Deploy

### Environment Variables

**Backend (.env)**
```env
PORT=5000
NODE_ENV=production
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Manual Testing
1. Create departments, classes, and students
2. Mark attendance for multiple students
3. View blockchain explorer to verify chain structure
4. Validate all blockchains
5. Check student ledger for attendance history

### Validation Testing
- Modify a block's data manually (if possible)
- Run validation to ensure chain shows as invalid
- Verify parent-child hash relationships

## 📝 Project Structure

```
Assignment_3/
├── backend/
│   ├── blockchain/
│   │   ├── Block.js
│   │   ├── Blockchain.js
│   │   └── BlockchainManager.js
│   ├── controllers/
│   │   ├── departmentController.js
│   │   ├── classController.js
│   │   ├── studentController.js
│   │   ├── attendanceController.js
│   │   └── blockchainController.js
│   ├── routes/
│   │   ├── departmentRoutes.js
│   │   ├── classRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── blockchainRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Departments.jsx
│   │   │   ├── Classes.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Attendance.jsx
│   │   │   └── BlockchainExplorer.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Custom blockchain implementation without external libraries
- SHA-256 cryptographic hashing
- Proof of Work consensus mechanism
- Hierarchical blockchain architecture

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Made with ❤️ using Node.js, React, and Custom Blockchain Implementation**
