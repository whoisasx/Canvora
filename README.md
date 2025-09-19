# Skema - Collaborative Online Whiteboard

[![GitHub stars](https://img.shields.io/github/stars/whoisasx/Canvora?style=social)](https://github.com/whoisasx/Canvora)
[![GitHub license](https://img.shields.io/github/license/whoisasx/Canvora)](https://github.com/whoisasx/Canvora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

Skema is a modern, collaborative online whiteboard application that enables teams to sketch, brainstorm, and diagram ideas together in real-time. Built with a clean, minimal UI and powered by modern web technologies, it provides an infinite canvas for creative collaboration.

## ✨ Features

### 🎨 **Rich Drawing Tools**

- **Freehand Drawing**: Natural pencil tool with pressure sensitivity
- **Shapes**: Rectangles, ellipses, rhombuses, lines, and arrows
- **Text Tools**: Multiple font families and styling options
- **Image Support**: Upload and manipulate images on canvas
- **Eraser Tool**: Clean removal of drawing elements

### 🤝 **Real-time Collaboration**

- **Live Cursors**: See teammates' cursor positions in real-time
- **Instant Sync**: All drawing actions synchronized across connected users
- **User Presence**: Know who's online and actively working
- **Room-based Sessions**: Create and join collaborative drawing rooms

### 🎯 **Advanced Canvas Features**

- **Infinite Canvas**: Unlimited drawing space with smooth pan and zoom
- **Layer Management**: Organize drawings with intelligent layering
- **Undo/Redo**: Full history tracking with undo/redo functionality
- **Performance Optimized**: Smooth rendering even with thousands of elements

### 🔐 **Authentication & Security**

- **Multiple Auth Providers**: GitHub, Google, and Discord OAuth integration
- **Secure Sessions**: JWT-based authentication with NextAuth.js
- **Room Access Control**: Admin-controlled room permissions

### 🎨 **Customization**

- **Theme Support**: Light and dark mode with system preference detection
- **Stroke Customization**: Width, style, and color options
- **Background Options**: Multiple canvas background choices
- **Shape Properties**: Fill, stroke, and style customization

## 🏗️ Architecture

Skema is built as a modern monorepo using Turborepo with a microservices architecture:

```
skema/
├── apps/
│   ├── skema-web/          # Next.js frontend application
│   └── ws-server/          # WebSocket server for real-time features
├── packages/
│   ├── db/                 # Prisma database schema and client
│   ├── ui/                 # Shared React components
│   ├── eslint-config/      # Shared ESLint configurations
│   └── typescript-config/  # Shared TypeScript configurations
└── docker-compose.yml      # Production deployment configuration
```

### Technology Stack

**Frontend (skema-web)**

- **Next.js 15.4.2** - React framework with App Router
- **React 19** - UI library with concurrent features
- **TailwindCSS 4.1** - Utility-first CSS framework
- **Motion** - Animation library for smooth interactions
- **RoughJS** - Hand-drawn style graphics rendering
- **Zustand** - Lightweight state management
- **NextAuth.js** - Authentication framework

**Backend Services**

- **WebSocket Server** - Real-time communication with Bun runtime
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary database
- **JWT** - Secure token-based authentication

**Development & Deployment**

- **Turborepo** - Monorepo build system
- **TypeScript** - Type safety across the stack
- **Docker** - Containerized deployment
- **Nginx** - Reverse proxy and load balancing
- **Bun** - Fast JavaScript runtime and package manager

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Bun** 1.2.16+ (recommended) or npm/yarn
- **PostgreSQL** database
- **Docker** (for production deployment)

### Development Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/whoisasx/Canvora.git
    cd skema
    ```

2. **Install dependencies**

    ```bash
    bun install
    ```

3. **Set up environment variables**

    Create `.env` files in both applications:

    **apps/skema-web/.env.local**

    ```env
    # Database
    DATABASE_URL="postgresql://username:password@localhost:5432/skema"

    # Authentication
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-secret-key"
    AUTH_SECRET="your-auth-secret"
    JWT_SECRET="your-jwt-secret"

    # OAuth Providers
    AUTH_GITHUB_ID="your-github-client-id"
    AUTH_GITHUB_SECRET="your-github-client-secret"
    AUTH_GOOGLE_ID="your-google-client-id"
    AUTH_GOOGLE_SECRET="your-google-client-secret"

    # WebSocket
    WS_URL="ws://localhost:8080"
    NEXT_PUBLIC_WS_URL="ws://localhost:8080"
    BASE_URL="http://localhost:3000"

    AUTH_TRUST_HOST=true
    ```

    **apps/ws-server/.env**

    ```env
    BASE_URL="http://localhost:3000"
    ```

4. **Set up the database**

    ```bash
    cd packages/db
    bunx prisma migrate dev
    bunx prisma generate
    cd ../..
    ```

5. **Start development servers**

    ```bash
    # Start all services
    bun dev

    # Or start individually
    bun dev --filter=@repo/web      # Frontend only
    bun dev --filter=ws-server      # WebSocket server only
    ```

6. **Access the application**
    - Frontend: http://localhost:3000
    - WebSocket Server: ws://localhost:8080

### Production Deployment

**Using Docker Compose (Recommended)**

1. **Configure environment**

    ```bash
    cp .env.example .env
    # Edit .env with production values
    ```

2. **Deploy with Docker**
    ```bash
    docker-compose up -d
    ```

The application will be available at http://localhost with Nginx handling routing and SSL termination.

## 📖 Usage

### Creating a Drawing Session

1. **Visit the homepage** and authenticate using GitHub, Google, or Discord
2. **Create a new room** or join an existing one using a room code
3. **Start drawing** using the toolbar on the left
4. **Invite collaborators** by sharing the room URL

### Drawing Tools

- **Select Tool (V)**: Select and manipulate existing elements
- **Pencil (P)**: Freehand drawing with customizable stroke
- **Rectangle (R)**: Create rectangular shapes
- **Ellipse (O)**: Draw circles and ellipses
- **Arrow (A)**: Create directional arrows
- **Line (L)**: Draw straight lines
- **Text (T)**: Add text annotations
- **Image (I)**: Upload and place images
- **Eraser (E)**: Remove elements from canvas

### Keyboard Shortcuts

- `V` - Select tool
- `P` - Pencil tool
- `R` - Rectangle tool
- `O` - Ellipse tool
- `A` - Arrow tool
- `L` - Line tool
- `T` - Text tool
- `E` - Eraser tool
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` - Redo
- `Ctrl/Cmd + +/-` - Zoom in/out
- `Space + Drag` - Pan canvas

## 🛠️ Development

### Project Structure

```
apps/skema-web/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── canvas/            # Canvas collaboration pages
│   ├── dashboard/         # User dashboard
│   ├── draw/              # Drawing engine and utilities
│   └── freehand/          # Offline drawing mode
├── components/            # React components
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions and stores

apps/ws-server/
├── index.ts              # Server entry point
├── server.ts             # WebSocket server implementation
├── messageHandlers.ts    # WebSocket message handlers
└── types.ts              # WebSocket message types

packages/
├── db/                   # Database schema and migrations
├── ui/                   # Shared UI components
├── eslint-config/        # Linting configurations
└── typescript-config/    # TypeScript configurations
```

### Contributing

1. **Fork the repository**
2. **Create a feature branch**
    ```bash
    git checkout -b feature/amazing-feature
    ```
3. **Make your changes**
4. **Run tests and linting**
    ```bash
    bun lint
    bun check-types
    ```
5. **Commit your changes**
    ```bash
    git commit -m 'Add amazing feature'
    ```
6. **Push to the branch**
    ```bash
    git push origin feature/amazing-feature
    ```
7. **Open a Pull Request**

### Available Scripts

```bash
# Development
bun dev                    # Start all development servers
bun dev --filter=web       # Start frontend only
bun dev --filter=ws-server # Start WebSocket server only

# Building
bun build                  # Build all applications
bun build --filter=web     # Build frontend only

# Code Quality
bun lint                   # Run ESLint on all packages
bun check-types           # Run TypeScript checks
bun format                # Format code with Prettier

# Database
cd packages/db
bunx prisma migrate dev    # Run database migrations
bunx prisma generate       # Generate Prisma client
bunx prisma studio         # Open Prisma Studio
```

## 🔧 Configuration

### Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: Authentication and user profile data
- **Room**: Drawing session metadata
- **Chat**: Real-time drawing message storage
- **Account**: OAuth provider account linking

### WebSocket Events

The real-time system handles various message types:

- `join-room` / `leave-room` - Room membership
- `draw-message` - Drawing operations
- `cursor` / `cursors-batch` - Cursor tracking
- `undo` / `redo` - History operations
- `sync-all` - Full canvas synchronization

### Authentication Providers

Configure OAuth providers in your environment:

- **GitHub**: Create OAuth app at https://github.com/settings/developers
- **Google**: Configure OAuth at https://console.cloud.google.com/
- **Discord**: Set up application at https://discord.com/developers/applications

## 🚀 Performance

Skema is optimized for performance with:

- **Canvas Virtualization**: Only renders visible elements
- **Message Throttling**: Prevents spam and reduces network load
- **Efficient Serialization**: Optimized data structures for WebSocket communication
- **IndexedDB Caching**: Offline storage for drawing data
- **Layer Management**: Smart rendering order for complex drawings

## 📝 API Reference

### REST API Endpoints

- `GET /api/rooms` - List user's rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/[id]` - Get room details
- `POST /api/create-chat` - Store drawing message
- `PATCH /api/update-chat` - Update drawing message
- `DELETE /api/delete-chat` - Remove drawing message

### WebSocket API

Connect to `ws://localhost:8080` and send JSON messages with the following structure:

```typescript
interface MessageData {
	type: "join-room" | "draw-message" | "cursor" | "undo" | "redo";
	roomId?: string;
	clientId?: string;
	message?: any;
	// ... additional fields based on message type
}
```

## 🔐 Security

- JWT-based authentication with secure token rotation
- CORS protection for API endpoints
- Input validation and sanitization
- Rate limiting on WebSocket connections
- Secure OAuth integration with major providers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Documentation**: Check out our [Wiki](https://github.com/whoisasx/Canvora/wiki)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/whoisasx/Canvora/issues)
- **Discussions**: Join the conversation in [GitHub Discussions](https://github.com/whoisasx/Canvora/discussions)

## 🙏 Acknowledgments

- Inspired by [Excalidraw](https://excalidraw.com/) for the drawing experience
- Built with [RoughJS](https://roughjs.com/) for hand-drawn style graphics
- Uses [Prisma](https://prisma.io/) for type-safe database access
- Powered by [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)

---

**Made with ❤️ by the Canvora team**
