# 📝 Task Manager

A full-stack Task Manager application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to create, manage, and organize their tasks with authentication and user profile management.

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 🔄 **Refresh Token System** - Automatic token refresh for seamless user experience
- ✅ **Task Management** - Create, read, update, and delete tasks
- 📊 **Task Status** - Track task completion status
- 👤 **User Profile** - View and update user profile information
- 🔒 **Password Management** - Secure password change functionality
- 🛡️ **Rate Limiting** - Protection against brute force attacks
- ✔️ **Input Validation** - Server-side validation for all requests
- 🌐 **CORS Support** - Configured for frontend-backend communication

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation middleware
- **express-rate-limit** - Rate limiting middleware

### Frontend
- **React** - UI library
- **Vite** - Build tool and development server

## 📁 Project Structure

```
Task-Manager/
├── back/                   # Backend API
│   ├── config/            # Database configuration
│   ├── controllers/       # Request handlers
│   ├── Middlewares/       # Custom middleware
│   ├── models/            # Mongoose models
│   ├── Router/            # API routes
│   ├── .env.example       # Environment variables template
│   ├── server.js          # Entry point
│   └── package.json
├── front/                 # Frontend React app
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
├── LICENSE
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/afnan0304/Task-Manager.git
   cd Task-Manager
   ```

2. **Backend Setup**
   ```bash
   cd back
   pnpm install
   ```

3. **Create Environment Variables**
   
   Copy the `.env.example` file to `.env` in the `back` folder:
   ```bash
   copy .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   REFRESH_SECRET=your_refresh_secret_key
   REFRESH_TOKEN_HASH_SECRET=your_hash_secret_key
   ACCESS_EXPIRES=15m
   REFRESH_EXPIRES=7d
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Frontend Setup**
   ```bash
   cd ../front
   pnpm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd back
   pnpm dev
   ```
   The server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd front
   pnpm dev
   ```
   The app will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | No |

### Task Routes (`/api/task`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/task` | Get all tasks for logged-in user | Yes |
| POST | `/api/task` | Create a new task | Yes |
| PUT | `/api/task/:id` | Update a task | Yes |
| PATCH | `/api/task/:id/status` | Update task status only | Yes |
| DELETE | `/api/task/:id` | Delete a task | Yes |

### User Profile Routes (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/me` | Get current user profile | Yes |
| PUT | `/api/user/me` | Update user profile | Yes |
| PUT | `/api/user/me/password` | Change password | Yes |

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### Token Lifecycle
- **Access Token**: Short-lived (default: 15 minutes)
- **Refresh Token**: Long-lived (default: 7 days)
- Use the refresh token endpoint to obtain a new access token

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Refresh token rotation
- Rate limiting on authentication endpoints
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | - |
| `JWT_SECRET` | Secret key for access tokens | - |
| `REFRESH_SECRET` | Secret key for refresh tokens | - |
| `REFRESH_TOKEN_HASH_SECRET` | Secret for hashing refresh tokens | - |
| `ACCESS_EXPIRES` | Access token expiration time | 15m |
| `REFRESH_EXPIRES` | Refresh token expiration time | 7d |
| `PORT` | Server port | 5000 |
| `FRONTEND_URL` | Frontend URL for CORS | * |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**afnan0304**
- GitHub: [@afnan0304](https://github.com/afnan0304)

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- MongoDB team for the flexible database
- React team for the powerful UI library

---

⭐ If you find this project helpful, please consider giving it a star!
