# 🚀 Project Management API

This project is developed and maintained by **Luis Gabriel Zamora Acevedo**, a candidate for the Bachelor’s degree in Computational Engineering at CONAIP.

A production-ready NestJS REST API for comprehensive project management. Built with modern TypeScript, featuring JWT authentication, role-based access control, and complete CRUD operations for managing projects, tasks, employees, clients, and assignments.

## 🔗 Live API

**🌍 Production API:** [https://api.thorium-technologies.com](https://api.thorium-technologies.com)

**📚 Interactive API Documentation:** [https://api.thorium-technologies.com/api/docs](https://api.thorium-technologies.com/api/docs)

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **Role-Based Access Control** - Admin and user roles with different permissions
- 📊 **Complete CRUD Operations** - Full create, read, update, delete functionality
- 🔍 **Advanced Search & Filtering** - Search across all entities with powerful filtering
- 📄 **Pagination Support** - Efficient pagination with configurable page sizes (limit=10, page=0)
- 📚 **Swagger Documentation** - Interactive API documentation with examples
- 🏗️ **Clean Architecture** - Domain-driven design with separation of concerns
- 🛡️ **Input Validation** - Comprehensive request validation using class-validator
- 🗄️ **PostgreSQL Integration** - Production-grade database with TypeORM
- 🐳 **Docker Support** - Containerized deployment ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL 17
- Docker (optional)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd project-management-api
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Environment Configuration:**

   ```bash
   cp .env.example .env
   ```

   Configure your environment variables:

   ```env
   # Application
   APP_PORT=3000
   NODE_ENV=development

   # Database
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=project_management
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_SSL=true

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ```

4. **Database Setup:**

   ```bash
   # Using Docker (recommended for development)
   docker run --name postgres-pm \
     -e POSTGRES_PASSWORD=your_password \
     -e POSTGRES_DB=project_management \
     -p 5432:5432 \
     -d postgres:17
   ```

5. **Start the application:**

   ```bash
   # Development mode with hot reload
   pnpm run start:dev

   # Production mode
   pnpm run build
   pnpm run start:prod
   ```

6. **Access the API:**

   - **API:** <http://localhost:3000>
   - **Documentation:** <http://localhost:3000/api/docs>

## 📚 API Documentation

### Swagger UI

The API includes comprehensive Swagger documentation available at:

- **🌍 Production:** [https://api.thorium-technologies.com/api/docs](https://api.thorium-technologies.com/api/docs)
- **🔧 Local:** <http://localhost:3000/api/docs>

### Authentication

The API uses JWT Bearer token authentication. To access protected endpoints:

1. **Login** to get a JWT token:

   ```bash
   POST /api/auth/login
   {
     "email": "admin@example.com",
     "password": "password"
   }
   ```

2. **Use the token** in subsequent requests:

   ```bash
   Authorization: Bearer <your-jwt-token>
   ```

3. **In Swagger UI**: Click the "Authorize" button and enter your token.

### Core Endpoints

| Module | Endpoint | Description |
|--------|----------|-------------|
| **Authentication** | `/api/auth` | User authentication & management |
| **Clients** | `/api/clients` | Client management operations |
| **Employees** | `/api/employees` | Employee management operations |
| **Projects** | `/api/projects` | Project management operations |
| **Tasks** | `/api/tasks` | Task management operations |
| **Assignments** | `/api/assignments` | Project-employee assignments |

### Pagination

All GET endpoints support pagination with query parameters:

- `limit` (default: 10) - Number of items per page
- `page` (default: 0) - Page number (0-based)
- `search` (optional) - Search term for filtering

Example:

```bash
GET /api/projects?limit=20&page=1&search=website
```

## 🔧 Development Scripts

```bash
# Development
pnpm run start:dev          # Start with hot reload
pnpm run start:debug        # Start in debug mode

# Building
pnpm run build              # Build for production
pnpm run start:prod         # Start production build

# Code Quality
pnpm run lint               # Run ESLint
pnpm run format             # Format code with Prettier

# Testing
pnpm run test               # Run unit tests
pnpm run test:watch         # Run tests in watch mode
pnpm run test:cov           # Run tests with coverage
pnpm run test:e2e           # Run end-to-end tests
```

## 🏗️ Architecture

This API follows Clean Architecture principles with a hexagonal architecture approach:

``` bash
src/
├── contexts/                    # Domain contexts (bounded contexts)
│   ├── auth/                   # Authentication & User Management
│   ├── clients/                # Client Management
│   ├── employees/              # Employee Management
│   ├── projects/               # Project Management
│   ├── tasks/                  # Task Management
│   ├── assignments/            # Project-Employee Assignments
│   └── shared/                 # Shared domain logic
│       ├── application/        # Application services & repositories
│       ├── domain/            # Domain entities & interfaces
│       └── infrastructure/    # External concerns (DB, HTTP, etc.)
└── main.ts                    # Application entry point
```

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t project-management-api .
```

### Run Container

```bash
docker run -d \
  --name pm-api \
  -p 3000:3000 \
  -e DATABASE_HOST=your-db-host \
  -e DATABASE_PASSWORD=your-password \
  -e JWT_SECRET=your-secret \
  project-management-api
```

## 🔒 Security Features

### Authentication & Authorization

- **JWT Tokens** - Secure, stateless authentication
- **Role-Based Access** - Admin and user roles with different permissions
- **Route Protection** - Decorators for endpoint security
- **Input Validation** - Comprehensive request validation

### Security Best Practices

- Passwords are hashed using bcrypt
- JWT tokens have configurable expiration
- SQL injection protection via TypeORM
- Input sanitization and validation
- CORS enabled for cross-origin requests
- SSL/TLS encryption support

## 🚀 Production Deployment

The API is currently deployed and accessible at:

**🌍 Production URL:** [https://api.thorium-technologies.com](https://api.thorium-technologies.com)

**📚 Live Documentation:** [https://api.thorium-technologies.com/api/docs](https://api.thorium-technologies.com/api/docs)

### Infrastructure Features

- **Platform:** Cloud deployment with SSL certificates
- **Database:** PostgreSQL 17 with connection pooling
- **Container:** Docker-based deployment
- **Monitoring:** Health checks and structured logging
- **Security:** HTTPS encryption and secure authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **📚 Documentation:** [https://api.thorium-technologies.com/api/docs](https://api.thorium-technologies.com/api/docs)
- **🐛 Issues:** Create an issue in this repository
- **🧪 API Testing:** Use the live Swagger documentation

---

**Built with ❤️ using NestJS, TypeScript, and PostgreSQL**
