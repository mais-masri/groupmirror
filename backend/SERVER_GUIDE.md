# 🚀 Server Configuration Guide

## Server Files Overview

After cleaning up the "salad" of server files, we now have a clean, organized structure:

### 📁 Current Server Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `backend/src/server.ts` | **Main Production Server** | Development & Production |
| `backend/mock-server.js` | **Mock Server** | Frontend-only development |

---

## 🎯 Which Server to Use

### For Development (Recommended)
```bash
cd backend
npm run dev
```
- **TypeScript server** with hot reload
- **Full database integration**
- **Proper authentication**
- **Production-ready structure**

### For Frontend-Only Development
```bash
cd backend
npm run dev:mock
```
- **Mock server** with fake data
- **No database required**
- **Quick frontend testing**
- **No authentication complexity**

### For Production
```bash
cd backend
npm run build
npm start
```
- **Compiled TypeScript**
- **Optimized for production**
- **Full feature set**

---

## 🛠️ Available Scripts

### Development Scripts
- `npm run dev` - Start TypeScript development server
- `npm run dev:mock` - Start mock server for frontend testing

### Production Scripts  
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run start:mock` - Start mock server

### Utility Scripts
- `npm run typecheck` - Check TypeScript without compilation
- `npm run seed` - Seed database with sample data
- `npm run health` - Check server health
- `npm run kill-3001` - Kill processes on port 3001

---

## 🔧 Server Features Comparison

| Feature | TypeScript Server | Mock Server |
|---------|------------------|-------------|
| **Database** | ✅ MongoDB Integration | ❌ No Database |
| **Authentication** | ✅ JWT + bcrypt | ❌ Mock Tokens |
| **Data Persistence** | ✅ Real Data | ❌ In-Memory Only |
| **Type Safety** | ✅ TypeScript | ❌ JavaScript |
| **Hot Reload** | ✅ Nodemon | ❌ Manual Restart |
| **Production Ready** | ✅ Yes | ❌ Development Only |
| **API Documentation** | ✅ `/api/docs` | ❌ Basic Info |

---

## 🌐 Server Endpoints

Both servers provide the same API endpoints:

### Health & Status
- `GET /health` - Detailed health check
- `GET /api/health` - Simple health check
- `GET /` - Server info and available endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Moods
- `GET /api/moods` - Get user moods
- `POST /api/moods` - Create mood entry

### Groups
- `GET /api/groups` - Get user groups
- `POST /api/groups` - Create new group

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

---

## 🚀 Quick Start Commands

### Start Development Server
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
npm start
```

### Start Mock Server (Frontend Only)
```bash
# Terminal 1: Mock Backend
cd backend
npm run dev:mock

# Terminal 2: Frontend
npm start
```

### Check Server Status
```bash
# Check if server is running
curl http://localhost:3001/health

# Or use the npm script
npm run health
```

---

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Kill processes on port 3001
npm run kill-3001

# Or manually
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Database Connection Issues
- **TypeScript Server**: Check MongoDB connection in `.env`
- **Mock Server**: No database required, just works!

### TypeScript Compilation Errors
```bash
# Check for TypeScript errors
npm run typecheck

# Clean and rebuild
rm -rf dist/
npm run build
```

---

## 📝 Environment Variables

### TypeScript Server (.env)
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/groupmirror
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:3000
```

### Mock Server
No environment variables required - just works!

---

## ✅ Summary

**The "salad" is now organized!** 

- ✅ **One main server**: `backend/src/server.ts` (TypeScript)
- ✅ **One mock server**: `backend/mock-server.js` (JavaScript)  
- ✅ **Clear purposes**: Development vs Mock vs Production
- ✅ **Simple commands**: `npm run dev` or `npm run dev:mock`
- ✅ **No confusion**: Each server has a specific use case

Choose the right server for your needs and enjoy a clean, organized development experience! 🎉
