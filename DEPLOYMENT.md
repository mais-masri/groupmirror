# GroupMirror Deployment Guide

## Environment Variables Setup

### Frontend (.env)
Create a `.env` file in the root directory with:
```
REACT_APP_API_URL=http://localhost:3001
```

For production, change to your deployed backend URL:
```
REACT_APP_API_URL=https://your-backend-domain.com
```

### Backend (.env)
Create a `.env` file in the `backend/` directory with:
```
PORT=3001
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/groupmirror
JWT_SECRET=your_jwt_secret_here_change_this_in_production
```

## Build Commands

### Frontend
```bash
npm run build
```

### Backend
```bash
npm run build
npm start
```

## Development Setup

### Local Development
1. Install dependencies: `npm install` (root) and `npm install` (backend)
2. Set up environment variables as shown above
3. Start development servers: `npm run dev`
4. Frontend runs on http://localhost:3000
5. Backend runs on http://localhost:3001

## Database
- Uses MongoDB Atlas (cloud database)
- No local database setup required
- Ensure IP address is whitelisted in MongoDB Atlas

