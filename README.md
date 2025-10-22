# ✨ GroupMirror - Your Personal & Collaborative Mood Tracker ✨

Developed under the supervision of **Prof. Roi Poranne** at the University of Haifa 🎓

---

## 🚀 Project Overview

**GroupMirror** is a modern web-based mood tracking platform that connects individuals and groups for collaborative mental health support. Track your daily moods, create supportive communities, and foster emotional well-being together.

---

## 🌟 Key Features

### 👤 **User Management**
- 🔐 Secure authentication with comprehensive validation
- 👋 Personalized dashboard with welcome messages
- ✏️ Profile management (name, username, email)
- 📊 Personal mood statistics and history

### 😊 **Mood Tracking**
- 📅 Calendar-based interface for logging moods
- 🎭 Multiple mood types (Happy, Motivated, Neutral, Sad, Stressed)
- 📝 Detailed entries with descriptions and levels (1-5 scale)
- 📈 Visual history with yearly, monthly, and daily views
- 🚫 Smart validation preventing future date entries

### 🤝 **Group Collaboration**
- 🏗️ Create private groups with unique invite codes
- 🔍 Real-time search functionality
- 👥 Member management and group statistics
- 💬 Group chat for emotional support
- 📊 Live mood analytics and collective insights

### ⚙️ **Customization**
- 🔔 Notification management (push, email, group alerts)
- 🎨 Light ☀️ and Dark 🌙 theme support
- 🔒 Privacy controls and mood sharing settings
- ⏰ Customizable reminder preferences

---

## 🛠️ Technologies

| Frontend | Backend | Database |
|----------|---------|----------|
| ⚛️ React.js | 🟢 Node.js | 🍃 MongoDB |
| 🎨 Tailwind CSS | 🚀 Express.js | 📊 Mongoose |
| 📱 Responsive Design | 📘 TypeScript | 🔑 JWT Authentication |

---

## 🚀 Quick Start

1. **Clone & Setup Backend**
   ```bash
   git clone [repository_url]
   cd groupmirrorproject/backend
   npm install
   cp .env.example .env  # Configure MongoDB URI and JWT_SECRET
   npm run dev
   ```

2. **Setup Frontend**
   ```bash
   cd ../src
   npm install
   cp .env.example .env  # Set REACT_APP_API_URL=http://localhost:3001
   npm start
   ```

3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

---

## 📁 Project Structure

```
groupmirrorproject/
├── 📁 backend/          # Node.js API server
│   ├── 📁 src/routes/   # API endpoints
│   ├── 📁 src/models/   # Database schemas
│   └── 📁 src/middleware/ # Auth & validation
├── 📁 src/              # React frontend
│   ├── 📁 pages/        # Main application pages
│   ├── 📁 components/   # Reusable UI components
│   └── 📁 services/     # API service layers
└── 📄 README.md
```

---

## 🔧 Available Scripts

**Backend:** `npm run dev` | `npm run build` | `npm run start`  
**Frontend:** `npm start` | `npm run build` | `npm test`

---

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/moods` | GET/POST | Mood entries |
| `/api/groups` | GET/POST | Group management |
| `/api/profile` | GET/PUT | Profile management |
| `/api/settings` | GET/PUT | Settings management |

---

## 🎯 Key Achievements

- ✅ **Real-time Mood Tracking** with calendar interface
- ✅ **Group Collaboration** with invite codes and search
- ✅ **Theme Management** with light/dark mode
- ✅ **Personalized Experience** with user-specific content
- ✅ **Comprehensive Validation** on frontend and backend
- ✅ **Database Integration** with MongoDB and Mongoose
- ✅ **Secure Authentication** with JWT and bcrypt

---

<div align="center">

**🌟 Developed with passion for better mental health tracking 🌟**

</div>