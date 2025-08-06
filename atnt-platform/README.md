# 🚀 ATNT Platform - Enterprise Financial Research Backend

> **Professional-grade financial research platform** built with Node.js, PostgreSQL, and enterprise architecture patterns. Equivalent to **Quartr.com** with AI-powered transcript analysis and real-time financial data.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Development Setup](#-development-setup)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### Core Financial Features
- 📊 **Real-time Stock Data** - Live prices, market data, financial metrics
- 📈 **Company Profiles** - Comprehensive company information and analytics
- 📄 **Transcript Management** - Upload, process, and analyze earnings calls
- 🤖 **AI-Powered Analysis** - ChatGPT integration for intelligent insights
- 🔍 **Advanced Search** - Full-text search across transcripts and data

### User Management
- 🔐 **Enterprise Authentication** - JWT with refresh tokens, account locking
- 👤 **User Profiles** - Customizable profiles with preferences
- 📋 **Watchlists** - Track favorite companies and investments
- 🚨 **Smart Alerts** - Intelligent notifications and price alerts
- 📊 **Personal Analytics** - User activity tracking and insights

### Technical Features
- 🏗️ **Enterprise Architecture** - MVC pattern with proper separation of concerns
- 🗄️ **PostgreSQL Database** - Professional database with migrations and seeds
- 🚀 **Redis Caching** - High-performance caching and session management
- 📡 **Real-time Updates** - WebSocket support for live data
- 🔒 **Security First** - Rate limiting, input validation, SQL injection prevention
- 📝 **Comprehensive Logging** - Winston logging with multiple transports
- 🧪 **Testing Suite** - Unit, integration, and E2E tests
- 🐳 **Docker Support** - Containerized development and production environments

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **ORM**: Knex.js with custom models
- **Authentication**: JWT + bcrypt
- **File Processing**: Multer + Sharp + PDF-Parse
- **AI Integration**: OpenAI GPT-4

### DevOps & Tools
- **Containerization**: Docker + Docker Compose
- **Process Management**: PM2
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier
- **Documentation**: Swagger/OpenAPI
- **Monitoring**: Sentry (optional)

## 🏗 Architecture

```
src/
├── config/           # Configuration management
├── controllers/      # Business logic handlers
├── middleware/       # Express middleware
├── models/          # Database models and queries
├── routes/          # API route definitions
├── services/        # External service integrations
├── utils/           # Utility functions and helpers
└── validators/      # Input validation schemas

database/
├── migrations/      # Database schema versions
└── seeds/          # Sample data for development

tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/           # End-to-end tests
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd atnt-platform
cp .env.example .env
```

### 2. Update Environment Variables
Edit `.env` file with your configuration:
```bash
# Add your OpenAI API key
OPENAI_API_KEY=your_actual_openai_key_here

# Database credentials (if not using Docker)
DB_PASSWORD=your_secure_password
```

### 3. Start with Docker (Recommended)
```bash
# Start all services (PostgreSQL + Redis + App)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### 4. Or Start Manually
```bash
# Install dependencies
npm install

# Start PostgreSQL and Redis (or use Docker for just these)
docker-compose up -d postgres redis

# Run database migrations
npm run db:migrate

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

### 5. Verify Installation
- **API**: http://localhost:3000/api/health
- **Swagger Docs**: http://localhost:3000/api-docs
- **pgAdmin**: http://localhost:5050 (admin@atnt-platform.com / admin123)
- **Redis Commander**: http://localhost:8081

## 💾 Database Schema

### Core Tables
- **users** - User authentication and profiles
- **companies** - Company information and financial data
- **transcripts** - Earnings calls and financial documents
- **ai_analyses** - AI-generated analysis results
- **watchlists** - User watchlists and items
- **smart_alerts** - Intelligent alert system
- **user_activity_log** - User activity tracking

### Key Features
- **Soft Deletes** - Data preservation with deleted_at timestamps
- **Audit Trails** - created_at/updated_at on all tables
- **Indexing** - Optimized indexes for performance
- **Relationships** - Proper foreign key constraints
- **JSON Fields** - Flexible metadata storage

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/refresh      # Refresh access token
POST /api/auth/logout       # User logout
```

### Core Business Endpoints
```
GET    /api/companies           # List companies
GET    /api/companies/:symbol   # Company details
POST   /api/transcripts         # Upload transcript
GET    /api/transcripts         # User's transcripts
POST   /api/transcripts/:id/analyze  # AI analysis
GET    /api/search             # Search across data
```

### User Features
```
GET    /api/watchlists         # User watchlists
POST   /api/watchlists         # Create watchlist
GET    /api/alerts            # User alerts
POST   /api/alerts            # Create alert
```

**Full API documentation available at**: `/api-docs` when running

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests only
npm run test:integration

# Watch mode for development
npm run test:watch
```

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start with nodemon
npm run debug           # Start with debugging

# Database
npm run db:migrate      # Run migrations
npm run db:seed         # Run seeds
npm run db:rollback     # Rollback migrations
npm run db:reset        # Reset database

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier

# Docker
npm run docker:build    # Build Docker image
npm run docker:run      # Run with Docker Compose
npm run docker:stop     # Stop Docker services
```

## 🚀 Deployment

### Production Environment
1. **Set Production Environment Variables**
2. **Use Production Database** (AWS RDS, Google Cloud SQL)
3. **Configure Redis** (AWS ElastiCache, Redis Cloud)
4. **Set up Monitoring** (Sentry, DataDog)
5. **Configure CI/CD Pipeline**

### Deployment Options
- **AWS**: ECS + RDS + ElastiCache
- **Google Cloud**: Cloud Run + Cloud SQL + Memorystore
- **Azure**: Container Instances + PostgreSQL + Redis Cache
- **Railway**: One-click deployment
- **Heroku**: Add-ons for PostgreSQL and Redis

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Rate limiting enabled

## 📈 Performance

### Optimization Features
- **Database Connection Pooling**
- **Redis Caching Strategy**
- **Optimized Database Indexes**
- **Background Job Processing**
- **File Upload Optimization**
- **API Response Compression**

### Monitoring
- **Application Metrics** - Response times, error rates
- **Database Metrics** - Query performance, connection usage
- **System Metrics** - CPU, memory, disk usage
- **Business Metrics** - User activity, feature usage

## 🔒 Security

### Implemented Security Measures
- **JWT Authentication** with refresh tokens
- **Password Hashing** with bcrypt
- **Rate Limiting** to prevent abuse
- **Input Validation** with Joi schemas
- **SQL Injection Prevention** with parameterized queries
- **XSS Protection** with helmet.js
- **CORS Configuration**
- **Security Headers**
- **Account Locking** after failed attempts
- **Audit Logging** for security events

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation
- Ensure all tests pass
- Follow semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Documentation**: Check the `/docs` folder
- **API Docs**: Available at `/api-docs`
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

**Built with ❤️ for professional financial research platforms**