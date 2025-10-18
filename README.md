# 🌟 GroupMirror

**A collaborative mood tracking application for teams, families, and friend groups**

GroupMirror helps groups track their collective emotional well-being through shared mood entries, visualizations, and insights. Perfect for teams wanting to improve workplace culture, families staying connected, or friend groups supporting each other's mental health.

![GroupMirror Demo](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=GroupMirror+Demo)

## ✨ Features

### 🎯 Core Functionality
- **Group Mood Tracking**: Create groups and track collective emotional states
- **Individual Mood Entries**: 1-5 scale mood logging with optional notes
- **Visual Analytics**: Interactive pie charts and mood calendars
- **Trend Analysis**: Track mood patterns over time
- **Real-time Updates**: See group mood changes as they happen

### 🔐 User Management
- **Secure Authentication**: JWT-based login/signup system
- **Protected Routes**: Secure access to group features
- **User Profiles**: Personal dashboard and settings
- **Group Management**: Create, join, and manage groups

### 📊 Data Visualization
- **Mood Calendar**: Visual calendar showing mood patterns
- **Pie Charts**: Group mood distribution analytics
- **Trends Page**: Historical mood data and insights
- **Dashboard**: Personal and group mood statistics

## 🚀 Tech Stack

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Font Awesome** for icons

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Zod** for validation
- **bcryptjs** for password hashing

### Development & Deployment
- **Docker** for local development
- **MongoDB Atlas** for production
- **Render/Railway** ready for deployment

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/groupmirror.git
   cd groupmirror
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   
   Create `.env` in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```
   
   Create `.env` in the `backend/` directory:
   ```env
   PORT=3001
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/groupmirror
   JWT_SECRET=your_jwt_secret_here_change_this_in_production
   ```

4. **Start MongoDB** (using Docker)
   ```bash
   docker-compose up -d
   ```

5. **Run the application**
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## 🎮 Usage

### Getting Started
1. **Sign up** for a new account or **log in**
2. **Create a group** or **join an existing group**
3. **Start logging moods** daily (1-5 scale)
4. **View group analytics** and trends
5. **Support each other** through shared insights

### Key Pages
- **Dashboard**: Personal mood overview and quick entry
- **Group Mood**: Collective group mood visualization
- **Trends**: Historical mood patterns and insights
- **Calendar**: Visual mood calendar view
- **Profile**: User settings and preferences

## 🚀 Deployment

### Production Build
```bash
# Frontend
npm run build

# Backend
cd backend
npm run build
npm start
```

### Environment Variables for Production
```env
# Frontend
REACT_APP_API_URL=https://your-backend-url.com

# Backend
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/groupmirror
JWT_SECRET=your_secure_jwt_secret_for_production
```

### Deployment Platforms
- **Render.com**: Full-stack deployment
- **Railway**: Easy GitHub integration
- **Vercel**: Frontend deployment
- **MongoDB Atlas**: Database hosting

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
groupmirror/
├── src/                    # Frontend React app
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API service layer
│   ├── contexts/          # React contexts
│   └── utils/             # Utility functions
├── backend/               # Backend Express API
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Custom middleware
│   │   └── validation/    # Input validation
│   └── dist/              # Compiled TypeScript
├── public/                # Static assets
├── docker-compose.yml     # Local MongoDB setup
└── package.json           # Frontend dependencies
```

## 🔧 Available Scripts

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm test           # Run tests
```

### Backend
```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript
npm start          # Start production server
npm run seed       # Seed database with sample data
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Group Endpoints
- `GET /api/groups` - List user's groups
- `POST /api/groups` - Create new group
- `GET /api/groups/:id` - Get group details
- `GET /api/groups/:id/moods` - Get group moods

### Mood Endpoints
- `GET /api/moods` - Get user's moods
- `POST /api/moods` - Create mood entry
- `GET /api/moods/trends` - Get mood trends

## 🐛 Known Issues

- Backend TypeScript compilation errors in production build (dev mode works perfectly)
- No automated tests (manual testing only)
- Limited error handling in some edge cases

## 🛠️ Future Enhancements

- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and insights
- [ ] Mood reminders and streaks
- [ ] Export mood data
- [ ] Group chat integration
- [ ] Mood-based recommendations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for beautiful styling
- MongoDB for the database solution
- All contributors and testers

---

**Made with ❤️ for better group well-being**