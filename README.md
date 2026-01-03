# Gamelib

A desktop application for managing your video game library with a modern, intuitive interface built with Electron, React, and SQLite.

![Project Banner](https://cdn.discordapp.com/attachments/1408187040302104586/1432638163024609300/image.png?ex=6901c7c3&is=69007643&hm=eb9f21bdc2be1a0bc6bbc40cbc0a65c0b2280d212fd265ba70578be8505e1855&)

## Features

- 🎮 **Game Management**: Add, update, delete, and organize your game collection
- 📋 **Custom Lists**: Create and manage personalized game lists
- 🔐 **User Authentication**: Register and login to maintain your personal library
- 🌐 **External Game Integration**: Import games from external sources
- 💾 **Data Persistence**: Local SQLite database for offline access
- 📤 **Import/Export**: Import and export your game library data
- 🎨 **Modern UI**: Clean and responsive interface powered by Material-UI

## Project Structure

```
gamelib/
├── electron/                 # Backend (Electron main process)
│   ├── src/
│   │   ├── main.ts          # Electron main process entry
│   │   ├── preload.js       # Preload script for IPC bridge
│   │   └── api/
│   │       ├── game.ts      # Game API handlers
│   │       ├── endpoints/   # API endpoints
│   │       ├── helper/      # Utility functions
│   │       └── sqlite/      # Database configuration & models
│   └── __tests__/           # Backend tests
│
├── frontend/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── main.jsx         # Entry point
│   │   ├── App.jsx          # Main component
│   │   ├── components/      # React components
│   │   ├── api/             # Frontend API calls
│   │   ├── Context/         # React context providers
│   │   └── styling/         # CSS modules
│   └── public/              # Static assets
│
├── package.json             # Root configuration
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## Tech Stack

### Backend
- **Electron**: Desktop application framework
- **TypeScript**: Type-safe JavaScript
- **SQLite**: Local database
- **Node.js**: JavaScript runtime

### Frontend
- **React 19**: UI library
- **Vite**: Build tool and dev server
- **Material-UI (MUI)**: Component library
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint**: Code quality

### Testing
- **Jest**: Testing framework

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/essmann/gamelib.git
cd gamelib
```

2. Install dependencies:
```bash
npm install
cd frontend && npm install
cd ../electron && npm install
cd ..
```

### Development

Start the development environment (frontend dev server + Electron with TypeScript watch):
```bash
npm start
```

This command runs:
- Frontend Vite dev server on `http://localhost:5173`
- Electron TypeScript compiler in watch mode
- Electron main process

### Build

Build both frontend and backend for production:
```bash
npm run compile
```

Then package the application:
```bash
cd electron
npm run build
```

## Available Scripts

### Root Level
- `npm start` - Start development environment with frontend, TypeScript compiler, and Electron
- `npm run compile` - Build frontend and compile TypeScript

### Frontend (`cd frontend`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend/Electron (`cd electron`)
- `npm start` - Start Electron
- `npm test` - Run backend tests with Jest
- `npm run build` - Build with electron-builder
- `npm run package` - Package with electron-forge
- `npm run make` - Make distributable with electron-forge

## IPC Communication

The preload script (`electron/src/preload.js`) exposes the following API methods to the frontend:

### Game Management
- `api.getGames(isLocal)` - Retrieve games
- `api.addGame(game)` - Add a new game
- `api.updateGame(game)` - Update game details
- `api.deleteGame(id)` - Delete a game
- `api.getExternalGames(prefix)` - Fetch external game data

### User Authentication
- `api.register(formData)` - Register new user
- `api.login(formData)` - Login user

### List Management
- `api.addList(name)` - Create a new list
- `api.getLists()` - Retrieve all lists
- `api.deleteList(listId)` - Delete a list
- `api.addToList(listId, gameId)` - Add game to list
- `api.deleteFromList(listId, gameId)` - Remove game from list

### Data Management
- `api.importData(jsonString)` - Import library data

## Database

The application uses SQLite for local data persistence:
- `games.db` - Main game library database
- `external_games.db` - External game data

Database schema includes models for:
- **Game**: Game information, metadata, and user ratings
- **List**: Custom game collections
- **ListItem**: Games within lists
- **Poster**: Game artwork
- **Tag**: Game categories/tags

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC License - see LICENSE file for details

## Author

essmann

## Repository

[GitHub - essmann/gamelib](https://github.com/essmann/gamelib)

## Known Issues & Future Work

- Database optimization needed (see TODO.txt)
- Consider reducing database bloat by storing minimal game information

---

**Happy gaming!** 🎮




