# Chat App Frontend

A modern real-time chat application built with React, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Login/Logout functionality
- **User List**: View all users with online/offline status
- **Search**: Search users by name or email
- **Real-time Chat**: Message exchange interface
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-friendly interface
- **Mock API**: Complete API layer ready for backend integration

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # App header with dark mode toggle
│   ├── UserList.tsx    # User list with search
│   └── ChatRoom.tsx    # Chat interface
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── DarkModeContext.tsx # Dark mode state
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   └── Chat.tsx        # Main chat page
├── services/           # API services
│   └── api.ts          # API layer with mock data
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

### Login

- Use any email and password to login (mock authentication)
- The app will create a user based on your email

### Chat

- Browse the user list on the left sidebar
- Use the search bar to find specific users
- Click on a user to open the chat
- Type messages in the input field and click "Send"
- Toggle dark mode using the sun/moon icon in the header
- Click "Logout" to sign out

## API Integration

The app is structured with a complete API service layer ready for backend integration. All API calls are in [src/services/api.ts](src/services/api.ts).

### API Methods

#### Authentication
- `authAPI.login(credentials)` - Login user
- `authAPI.logout()` - Logout user

#### Users
- `userAPI.getUsers()` - Get all users
- `userAPI.searchUsers(query)` - Search users

#### Messages
- `messageAPI.getMessages(userId)` - Get messages with a user
- `messageAPI.sendMessage(receiverId, content)` - Send a message

### Backend Integration

To connect to your backend, replace the mock implementations in `src/services/api.ts`:

```typescript
// Example: Replace mock login with real API call
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch('http://your-backend-url/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },
};
```

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Context API** - State management

## Mock Data

The app includes mock data for development:
- 5 sample users (some online, some offline)
- Sample conversation history
- Simulated API delays for realistic behavior

## Dark Mode

Dark mode preference is saved to localStorage and persists across sessions.

## Build

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Notes

- The TypeScript errors shown in the IDE are expected before running `npm install`
- After installing dependencies, run the dev server to see the app in action
- All API calls currently use mock data - replace with real API endpoints when backend is ready
