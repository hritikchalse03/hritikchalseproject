# 🚀 Getting Started Guide - Complete Beginner

Welcome! This guide will help you get your FinanceStream platform up and running, even if you've never coded before.

## 📋 Prerequisites (What You Need First)

### 1. Install Required Software

**Node.js** (JavaScript Runtime)
- Visit: https://nodejs.org
- Download the LTS version (Long Term Support)
- Install with default settings
- Verify: Open terminal/command prompt and type `node --version`

**Docker Desktop** (Containerization)
- Visit: https://docker.com/products/docker-desktop
- Download for your OS (Windows/Mac/Linux)
- Install and start Docker Desktop
- Verify: Type `docker --version` in terminal

**VS Code** (Code Editor)
- Visit: https://code.visualstudio.com
- Download and install
- Install these extensions:
  - Thunder Client (for API testing)
  - Prisma (database tools)
  - ES7+ React/Redux/React-Native snippets

**Git** (Version Control)
- Visit: https://git-scm.com
- Download and install
- Verify: Type `git --version` in terminal

## 🏁 Quick Start (5 Minutes)

### Step 1: Get the Code
```bash
# Clone this repository (download the code)
git clone <your-repo-url>
cd financestream

# Install dependencies (download required packages)
npm install
```

### Step 2: Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your API keys
# You'll need:
# - OpenAI API key (for transcription)
# - Your financial data API keys
```

### Step 3: Start Everything
```bash
# Start all services (database, backend, frontend)
npm run setup

# This will:
# 1. Start Docker containers (database, cache, search)
# 2. Run database migrations (set up tables)
# 3. Seed sample data
# 4. Start the backend API server
# 5. Start the frontend web app
```

### Step 4: Open Your App
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs

## 🎯 What Each Part Does

### Backend (API Server) - Port 8000
**What it is**: The "brain" of your application
**What it does**:
- Handles user login/registration
- Manages company data
- Processes audio files
- Generates transcripts
- Provides search functionality

**Key files**:
- `backend/api-gateway/src/index.ts` - Main server file
- `backend/api-gateway/src/routes/` - API endpoints
- `backend/api-gateway/prisma/schema.prisma` - Database structure

### Frontend (Web App) - Port 3000
**What it is**: The "face" of your application (what users see)
**What it does**:
- Beautiful user interface
- Login/registration forms
- Live audio player
- Search functionality
- Real-time transcript display

**Key files**:
- `frontend/web/src/app/page.tsx` - Home page
- `frontend/web/src/components/` - Reusable UI components
- `frontend/web/src/lib/` - Utility functions

### Database (PostgreSQL) - Port 5432
**What it is**: Where all your data is stored
**What it stores**:
- User accounts
- Company information
- Earnings call metadata
- Transcripts
- User preferences

### Search Engine (Elasticsearch) - Port 9200
**What it is**: Super-fast search through transcripts
**What it does**:
- Indexes all transcript content
- Provides instant search results
- Supports complex queries

### Cache (Redis) - Port 6379
**What it is**: Temporary storage for fast access
**What it does**:
- Stores user sessions
- Caches frequently accessed data
- Manages real-time features

## 🔧 Development Workflow

### Daily Development Process:
1. **Start your day**: `npm run dev`
2. **Make changes**: Edit files in VS Code
3. **Test changes**: Check http://localhost:3000
4. **Check API**: Use http://localhost:8000/api/docs
5. **End your day**: `npm run docker:down`

### Common Commands:
```bash
# Start development servers
npm run dev

# Stop all services
npm run docker:down

# View logs
docker-compose logs -f

# Reset database
npm run db:reset

# Run tests
npm test
```

## 📁 Project Structure Explained

```
financestream/
├── 📁 backend/                 # Server-side code
│   ├── 📁 api-gateway/         # Main API server
│   │   ├── 📁 src/             # Source code
│   │   │   ├── 📁 routes/      # API endpoints (/api/auth, /api/companies)
│   │   │   ├── 📁 services/    # Business logic
│   │   │   ├── 📁 middleware/  # Request processing
│   │   │   └── 📄 index.ts     # Main server file
│   │   ├── 📁 prisma/          # Database configuration
│   │   └── 📄 package.json     # Dependencies
│   └── 📁 shared/              # Shared utilities
├── 📁 frontend/                # Client-side code
│   └── 📁 web/                 # Web application
│       ├── 📁 src/             # Source code
│       │   ├── 📁 app/         # Pages (Next.js App Router)
│       │   ├── 📁 components/  # Reusable UI components
│       │   ├── 📁 lib/         # Utilities and API calls
│       │   └── 📁 hooks/       # Custom React hooks
│       └── 📄 package.json     # Dependencies
├── 📁 infrastructure/          # Deployment configuration
├── 📄 docker-compose.yml       # Local development setup
├── 📄 package.json             # Root dependencies
└── 📄 README.md               # Project documentation
```

## 🎨 Your First Customization

Let's make a simple change to see how everything works:

### Change the App Title:
1. Open `frontend/web/src/app/layout.tsx`
2. Find line with `title: 'FinanceStream...'`
3. Change it to `title: 'My Finance App...'`
4. Save the file
5. Refresh http://localhost:3000
6. See your change in the browser tab!

## 🔌 Integrating Your API Access

Since you have API access to live calls and transcripts, here's how to integrate them:

### Step 1: Add Your API Configuration
Edit `.env` file:
```env
# Your Financial Data APIs
FINANCIAL_API_URL=your-api-endpoint
FINANCIAL_API_KEY=your-api-key
LIVE_CALLS_API_URL=your-live-calls-endpoint
TRANSCRIPTS_API_URL=your-transcripts-endpoint
```

### Step 2: Create API Service
Create `backend/api-gateway/src/services/externalApiService.ts`:
```typescript
// This will connect to your external APIs
export class ExternalApiService {
  async getLiveCalls() {
    // Your API integration code here
  }
  
  async getTranscripts(callId: string) {
    // Your API integration code here
  }
}
```

## 🐛 Troubleshooting

### Common Issues:

**Port already in use**:
```bash
# Kill processes on ports
npx kill-port 3000 8000 5432
```

**Docker not starting**:
- Make sure Docker Desktop is running
- Try: `docker system prune -a`

**Database connection failed**:
```bash
# Reset database
npm run docker:down
npm run docker:up
npm run db:migrate
```

**Frontend not loading**:
- Check if backend is running on port 8000
- Clear browser cache
- Check browser console for errors

## 📚 Learning Resources

### Next Steps to Learn:
1. **JavaScript Basics**: https://javascript.info
2. **React Tutorial**: https://react.dev/learn
3. **Node.js Guide**: https://nodejs.org/en/docs/guides
4. **Database Concepts**: https://www.postgresql.org/docs/

### Recommended Learning Path:
1. **Week 1**: Get familiar with the codebase, make small UI changes
2. **Week 2**: Learn JavaScript basics, understand API calls
3. **Week 3**: Integrate your external APIs
4. **Week 4**: Add new features and customize the interface

## 🎯 Your Academic Project Roadmap

### Phase 1: Setup & Understanding (Week 1)
- [ ] Get everything running locally
- [ ] Understand the project structure
- [ ] Make your first UI customization
- [ ] Document what each part does

### Phase 2: Integration (Week 2-3)
- [ ] Connect your live calls API
- [ ] Integrate transcript API
- [ ] Test data flow
- [ ] Add error handling

### Phase 3: Features (Week 4-6)
- [ ] Add company search
- [ ] Implement live streaming
- [ ] Create transcript viewer
- [ ] Add user authentication

### Phase 4: Polish (Week 7-8)
- [ ] Improve UI/UX
- [ ] Add mobile responsiveness
- [ ] Write documentation
- [ ] Prepare presentation

## 🆘 Getting Help

When you're stuck:
1. Check the browser console (F12)
2. Look at server logs: `docker-compose logs -f api-gateway`
3. Read error messages carefully
4. Google the specific error
5. Ask for help with specific error messages

Remember: Every developer started as a beginner. Take it one step at a time! 🚀