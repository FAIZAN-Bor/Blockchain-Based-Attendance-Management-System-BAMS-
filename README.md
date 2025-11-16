# 🔐 Blockchain-Based Attendance Management System (BAMS)

<div align="center">

![Project Banner](https://img.shields.io/badge/Blockchain-Attendance_System-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### 🎓 A Decentralized, Immutable Attendance Tracking System Using Multi-Layer Blockchain Architecture

[🚀 Live Demo](https://blockchain-attendance-frontend.onrender.com) | [📖 Documentation](#-api-documentation) | [🎯 Features](#-features) | [⚙️ Installation](#-installation)

</div>

---

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

The **Blockchain-Based Attendance Management System (BAMS)** is a revolutionary educational application that leverages blockchain technology to create a transparent, tamper-proof attendance tracking system. Built from scratch without external blockchain libraries, BAMS demonstrates the power of decentralized data management in educational institutions.

### 🌟 Why BAMS?

Traditional attendance systems suffer from:
- ❌ Data manipulation and tampering
- ❌ Lack of transparency
- ❌ Single points of failure
- ❌ No audit trail

**BAMS solves these problems by:**
- ✅ **Immutable Records**: Once recorded, attendance cannot be altered
- ✅ **Complete Transparency**: Every change is permanently logged
- ✅ **Decentralized Architecture**: No single point of failure
- ✅ **Full Audit Trail**: Every transaction is traceable and verifiable

### 🏆 Key Highlights
- 🔗 **3-Layer Blockchain Hierarchy**: Department → Class → Student → Attendance
- 🔐 **Custom SHA-256 Hashing**: Pure Node.js implementation, zero external blockchain libraries
- ⛏️ **Proof of Work (PoW)**: Mining with difficulty target `0000` (4 leading zeros)
- 📝 **Full CRUD Operations**: Create, Read, Update (append-only), Delete (soft delete via blockchain)
- ✅ **Multi-Level Validation**: Validates entire chain hierarchy with parent-child relationships
- 🔍 **Real-time Blockchain Explorer**: Interactive visualization of all blocks and transactions
- 🚀 **RESTful API**: Complete backend API with 25+ endpoints
- 🎨 **Modern UI**: React-based responsive frontend with gradient designs
- 📊 **Analytics Dashboard**: Real-time statistics and blockchain health monitoring

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

BAMS implements a unique **hierarchical blockchain architecture** where each layer extends from its parent, creating an interconnected web of immutable ledgers:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPARTMENT BLOCKCHAIN (Layer 1)               │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │ Genesis Block│ ───→ │   Block 1    │ ───→ │   Block 2    │  │
│  │ prevHash: 0  │      │ (Create CS)  │      │ (Update CS)  │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Links via hash
                    ┌───────────┴───────────┐
                    ▼                       ▼
┌────────────────────────────────┐  ┌────────────────────────────────┐
│     CLASS BLOCKCHAIN (Layer 2) │  │     CLASS BLOCKCHAIN (Layer 2) │
│  ┌──────────────┐  ┌─────────┐│  │  ┌──────────────┐  ┌─────────┐│
│  │ Genesis Block│→ │ Block 1 ││  │  │ Genesis Block│→ │ Block 1 ││
│  │ prevHash: CS │  │ (Sem 1) ││  │  │ prevHash: CS │  │ (Sem 2) ││
│  └──────────────┘  └─────────┘│  │  └──────────────┘  └─────────┘│
└────────────┬───────────────────┘  └────────────────────────────────┘
             │ Links via hash
   ┌─────────┴─────────┐
   ▼                   ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│ STUDENT BLOCKCHAIN (L3)  │  │ STUDENT BLOCKCHAIN (L3)  │
│ ┌────────┐  ┌─────────┐ │  │ ┌────────┐  ┌─────────┐ │
│ │Genesis │→ │Attendance│ │  │ │Genesis │→ │Attendance│ │
│ │prevHash│  │ Block 1 │ │  │ │prevHash│  │ Block 1 │ │
│ │= Class │  │Present  │ │  │ │= Class │  │Absent   │ │
│ └────────┘  └─────────┘ │  │ └────────┘  └─────────┘ │
└──────────────────────────┘  └──────────────────────────┘
```

### 🔄 Data Flow & Chain Linking

1. **Department Creation** 
   - Creates independent blockchain with genesis block
   - Genesis `prevHash = '0'`
   - Stores department metadata (name, code)

2. **Class Creation** 
   - Links genesis block to parent department's latest hash
   - Inherits department context
   - Creates new chain for class data

3. **Student Creation** 
   - Links genesis block to parent class's latest hash
   - Inherits department + class context
   - Creates personal attendance ledger

4. **Attendance Recording** 
   - Appends new block to student's blockchain
   - Includes timestamp, status, metadata
   - Mined with Proof of Work (difficulty: 4)

### 🔐 Security Features

- **Hash Chaining**: Each block contains previous block's hash
- **Proof of Work**: Mining required for each block (4 leading zeros)
- **Immutability**: Historical data cannot be altered
- **Parent-Child Validation**: Verifies cross-chain relationships
- **Soft Deletes**: Deletion creates new block (no data removal)

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

The system automatically initializes with sample data:
- 🏢 **2 Departments**: School of Computing, School of Software Engineering
- 📚 **5 Classes** per department (various semesters and sections)
- 👨‍🎓 **35 Students** per class with unique roll numbers

You can add, modify, or remove these through the intuitive UI.

### 🎨 Accessing the Application

Once both servers are running:

1. **Frontend**: http://localhost:5173
2. **Backend API**: http://localhost:5000/api/health
3. **Blockchain Explorer**: http://localhost:5173/blockchain

### 🌐 Live Deployment

**Production URLs:**
- 🌍 **Frontend**: https://blockchain-attendance-frontend.onrender.com
- 🔌 **Backend API**: https://blockchain-based-attendance-management.onrender.com/api

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

## 📸 Screenshots & Features Showcase

### 📊 Dashboard
- **Real-time Statistics**: Total departments, classes, students, and blockchain status
- **Validation Panel**: Visual indicators for blockchain integrity (Valid/Invalid chains)
- **System Health**: Monitor blockchain performance and validation status
- **Quick Actions**: Access all features from centralized hub

### 🏢 Department Management
- **Create Departments**: Add new departments with unique codes
- **Search & Filter**: Quickly find departments
- **Blockchain View**: See department's blockchain structure
- **Soft Delete**: Archive departments via blockchain

### 📚 Class Management
- **Department Filtering**: View classes by department
- **Semester & Section**: Organize by academic periods
- **Student Count**: Track enrollment per class
- **Parent Chain Linking**: Each class links to department blockchain

### 👨‍🎓 Student Management
- **Dual Filters**: Filter by department and class
- **Student Search**: Find students by name, roll number, or email
- **Blockchain Ledger**: View individual student's attendance history
- **Attendance Stats**: Track attendance percentage per student

### ✅ Attendance System
- **Three View Modes**: 
  - 📝 Mark Attendance (bulk operations)
  - 📅 Today's Attendance (daily overview)
  - 📊 Student History (individual tracking)
- **Statistics Cards**: Total records, present count, absent count, percentage
- **Date-wise Filtering**: View attendance by date range
- **Blockchain Recording**: Every attendance mark creates a mined block

### 🔍 Blockchain Explorer
- **Interactive Visualization**: See all blockchains in the system
- **Block Details**: View hash, nonce, timestamp, transactions
- **Chain Validation**: Real-time integrity checking
- **Transaction History**: Trace all operations across chains
- **Multi-Layer View**: Navigate between department, class, and student chains

## 🌐 Deployment

### 🚀 Quick Deployment Guide

This project is deployed on **Render** (Free Tier) with automatic GitHub integration.

#### 📡 Backend Deployment (Render)

1. **Create Render Account**: Sign up at [render.com](https://render.com)
2. **New Web Service**: Click "New +" → "Web Service"
3. **Connect Repository**: Link your GitHub repo
4. **Configure Settings**:
   ```yaml
   Name: blockchain-attendance-backend
   Region: Choose nearest location
   Branch: main
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```
5. **Environment Variables** (Optional):
   ```env
   PORT=5000
   NODE_ENV=production
   ```
6. **Deploy**: Click "Create Web Service"
7. **Copy Backend URL**: Save for frontend configuration

**Important**: Backend binds to `0.0.0.0` for Render compatibility.

#### 🎨 Frontend Deployment (Render)

1. **New Static Site**: Click "New +" → "Static Site"
2. **Select Repository**: Same GitHub repo
3. **Configure Settings**:
   ```yaml
   Name: blockchain-attendance-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
4. **Environment Variable** (Required):
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
5. **Deploy**: Click "Create Static Site"

#### 🔄 Auto-Deployment

Both services auto-deploy on every `git push` to main branch.

### 📝 Environment Configuration

**Backend (.env.example)**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration (for production)
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

**Frontend (.env.production)**
```env
# Backend API URL
VITE_API_URL=https://blockchain-based-attendance-management.onrender.com/api
```

**Frontend (.env.development)**
```env
# Local Development
VITE_API_URL=http://localhost:5000/api
```

### 🎯 Deployment Checklist

- ✅ Backend binds to `0.0.0.0:PORT`
- ✅ Frontend environment variable set correctly
- ✅ CORS configured with frontend URL
- ✅ Git repository pushed to GitHub
- ✅ Both services show "Live" status on Render
- ✅ Health check endpoint responding: `/api/health`
- ✅ Frontend loads without CORS errors

### 📚 Alternative Deployment Options

| Platform | Backend | Frontend | Cost |
|----------|---------|----------|------|
| **Render** | ✅ Web Service | ✅ Static Site | Free Tier |
| **Vercel + Railway** | Railway | Vercel | Free Tier |
| **Heroku** | ✅ Dyno | ✅ Dyno | $7/month |
| **AWS** | EC2/Elastic Beanstalk | S3+CloudFront | Pay-as-you-go |

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

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

## 🎓 Academic Context

This project was developed as part of a blockchain course assignment, demonstrating:
- ✅ **Deep understanding** of blockchain fundamentals
- ✅ **Custom implementation** without external blockchain libraries
- ✅ **Real-world application** of cryptographic concepts
- ✅ **Full-stack development** skills
- ✅ **System architecture** design and implementation

### 📊 Project Statistics

- **Backend**: ~2,500 lines of code
- **Frontend**: ~3,000 lines of code
- **API Endpoints**: 25+
- **React Components**: 6 pages + services
- **Blockchain Layers**: 3-tier hierarchy
- **Hash Algorithm**: SHA-256
- **Mining Difficulty**: 4 (0000)
- **Development Time**: Academic semester project

## 🏆 Key Achievements

- 🔐 **Zero External Blockchain Libraries**: Pure Node.js crypto implementation
- ⛓️ **Multi-Layer Architecture**: Innovative hierarchical blockchain design
- 🎨 **Modern UI/UX**: Gradient designs, icons, responsive layouts
- 📈 **Scalability**: Handles multiple departments, classes, and thousands of students
- ✅ **Data Integrity**: Complete validation system across all chains
- 🚀 **Production Ready**: Deployed and accessible online

## 👥 Author

**Muhammad Faizan** - Full Stack Developer & Blockchain Enthusiast
- GitHub: [@FAIZAN-Bor](https://github.com/FAIZAN-Bor)
- Repository: [Blockchain-Based-Attendance-Management-System-BAMS-](https://github.com/FAIZAN-Bor/Blockchain-Based-Attendance-Management-System-BAMS-)

## 🙏 Acknowledgments

- **Custom Blockchain Implementation**: Built from scratch using Node.js crypto module
- **SHA-256 Hashing**: Industry-standard cryptographic hash function
- **Proof of Work**: Bitcoin-inspired mining mechanism
- **Hierarchical Architecture**: Novel approach to educational data management
- **React & Vite**: Modern frontend development stack
- **Express.js**: Robust backend framework

## 📞 Support & Contact

- 📧 **Email**: [Your Email]
- 🐛 **Issues**: [GitHub Issues](https://github.com/FAIZAN-Bor/Blockchain-Based-Attendance-Management-System-BAMS-/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/FAIZAN-Bor/Blockchain-Based-Attendance-Management-System-BAMS-/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/FAIZAN-Bor/Blockchain-Based-Attendance-Management-System-BAMS-/wiki)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🌟 Star This Repository

If you find this project useful or interesting, please consider giving it a ⭐️ on GitHub!

---

<div align="center">

### 🔗 Quick Links

[🚀 Live Demo](https://blockchain-attendance-frontend.onrender.com) • 
[📖 Documentation](./DEPLOYMENT_GUIDE.md) • 
[🐛 Report Bug](https://github.com/FAIZAN-Bor/Blockchain-Based-Attendance-Management-System-BAMS-/issues) • 
[✨ Request Feature](https://github.com/FAIZAN-Bor/Blockchain-Based-Attendance-Management-System-BAMS-/issues)

### Made with ❤️ using Node.js, React, and Custom Blockchain Implementation

**© 2025 Muhammad Faizan. All Rights Reserved.**

![Blockchain](https://img.shields.io/badge/Blockchain-Custom-orange?style=flat-square)
![SHA-256](https://img.shields.io/badge/Hash-SHA--256-red?style=flat-square)
![PoW](https://img.shields.io/badge/Consensus-Proof_of_Work-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production-success?style=flat-square)

</div>
