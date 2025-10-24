# GroupMirror

This project was built for my coursework at University of Haifa under the supervision of Prof. Roi Poranne.

---

**GroupMirror - Collaborative Wellness Platform**

An innovative digital platform that enables communities to monitor emotional health and build stronger connections through shared mood experiences.

## Overview

GroupMirror allows users to track their daily moods, join groups with friends or colleagues, and share their emotional state in a supportive environment. The application provides insights into group mood patterns and facilitates communication through group chat features.

## Features

- **Mood Tracking**: Record daily moods with ratings and notes
  - 😊 Happy (Level 5) - Feeling great and positive
  - 🌱 Motivated (Level 4) - Ready to tackle challenges  
  - ⚪ Neutral (Level 3) - Balanced and steady
  - 🌧️ Sad (Level 2) - Feeling down or low
  - 🔥 Stressed (Level 1) - Overwhelmed or anxious
- **Group Management**: Create or join groups with invite codes
- **Group Chat**: Communicate with group members
- **Mood Analytics**: View group mood distributions and trends
- **User Profiles**: Manage personal information and settings
- **Theme Support**: Light and dark mode options

## Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- React Router

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd groupmirrorproject
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy the environment template: `cp .env.example .env`
   - Edit the `.env` file with your actual credentials:
     - Replace `<your-username>` and `<your-password>` with your MongoDB credentials
     - Replace `your-super-secret-jwt-key-change-this-in-production` with a strong JWT secret
     - Adjust other settings as needed
   - **Important**: Never commit the `.env` file to version control

4. Start the development servers:
```bash
npm run dev
```

This will start both frontend (port 3000) and backend (port 3001) servers.

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Create Group**: Set up a group and get an invite code
3. **Join Group**: Use invite codes to join existing groups
4. **Track Moods**: Record daily mood entries
5. **Group Chat**: Communicate with group members
6. **View Analytics**: Check group mood patterns and statistics

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create new group
- `POST /api/groups/join` - Join group with invite code

### Moods
- `GET /api/moods` - Get user's mood entries
- `POST /api/moods` - Create new mood entry

### Chat
- `GET /api/chat/:groupId` - Get group messages
- `POST /api/chat/:groupId` - Send message to group

## Database Schema

### User
- Basic profile information
- Authentication credentials
- Account settings

### Group
- Group name and description
- Admin and member references
- Invite codes

### Mood
- User reference
- Mood level (1-5)
- Mood type and description
- Date timestamp

### Message
- Group and user references
- Message content and type
- Timestamps

## Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run clear-demo` - Clear demo data

**Frontend:**
- `npm start` - Start React development server
- `npm run build` - Build for production

### Project Structure

```
groupmirrorproject/
├── backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication & validation
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── contexts/        # React contexts
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

*"Taking care of your mental health is not a luxury, it's a necessity."* ❤️