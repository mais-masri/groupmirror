# GroupMirror Deployment Guide

## Environment Variables Setup

### Frontend (.env)
Create a `.env` file in the root directory with:
```
REACT_APP_API_URL=http://localhost:3001
```

For production, change to your deployed backend URL:
```
REACT_APP_API_URL=https://your-backend-app.onrender.com
```

### Backend (.env)
Create a `.env` file in the `backend/` directory with:
```
PORT=3001
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/groupmirror
JWT_SECRET=your_jwt_secret_here_change_this_in_production
```

For production with MongoDB Atlas:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/groupmirror
```

## Build Commands

### Frontend
```bash
npm run build
npm run preview
```

### Backend
```bash
npm run build
npm start
```

## Deployment Platforms

### Render.com
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Use build commands above
4. Set Node.js version to 18+

### Railway
1. Connect repository
2. Add environment variables
3. Auto-deploys on push

### Vercel (Frontend only)
1. Connect repository
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Add environment variables

