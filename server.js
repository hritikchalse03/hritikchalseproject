const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// In-memory database (replace with real database in production)
let users = [];
let watchlists = [];
let alerts = [];
let companies = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 189.84,
        change: 2.34,
        changePercent: 1.25,
        marketCap: '2.95T',
        sector: 'Technology'
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 374.12,
        change: 5.67,
        changePercent: 1.54,
        marketCap: '2.78T',
        sector: 'Technology'
    },
    {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 138.45,
        change: -1.23,
        changePercent: -0.88,
        marketCap: '1.74T',
        sector: 'Technology'
    },
    {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        price: 248.91,
        change: 12.45,
        changePercent: 5.26,
        marketCap: '789B',
        sector: 'Automotive'
    }
];

let events = [
    {
        id: '1',
        company: 'AAPL',
        title: 'Q4 2024 Earnings Call',
        type: 'earnings',
        status: 'live',
        startTime: new Date(),
        attendees: 1247,
        description: 'Apple reports Q4 2024 results with record revenue of $94.9B.'
    },
    {
        id: '2',
        company: 'TSLA',
        title: 'Investor Day Presentation',
        type: 'investor-day',
        status: 'live',
        startTime: new Date(),
        attendees: 2156,
        description: 'Tesla presents latest developments in autonomous driving.'
    }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Helper function to generate tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    return { accessToken };
};

// Routes

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pages/:page', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', req.params.page));
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            tier: 'free',
            createdAt: new Date(),
            stats: {
                companiesFollowed: 0,
                eventsAttended: 0,
                activeAlerts: 0,
                daysActive: 1
            }
        };

        users.push(user);

        // Generate tokens
        const tokens = generateTokens(user);

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                tier: user.tier,
                stats: user.stats
            },
            ...tokens
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate tokens
        const tokens = generateTokens(user);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                tier: user.tier,
                stats: user.stats
            },
            ...tokens
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// User Routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        tier: user.tier,
        stats: user.stats
    });
});

app.put('/api/user/profile', authenticateToken, (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { firstName, lastName, email } = req.body;
    users[userIndex] = {
        ...users[userIndex],
        firstName: firstName || users[userIndex].firstName,
        lastName: lastName || users[userIndex].lastName,
        email: email || users[userIndex].email
    };

    res.json({ message: 'Profile updated successfully' });
});

// Company Routes
app.get('/api/companies', (req, res) => {
    const { search, sector } = req.query;
    let filteredCompanies = companies;

    if (search) {
        filteredCompanies = filteredCompanies.filter(company =>
            company.name.toLowerCase().includes(search.toLowerCase()) ||
            company.symbol.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (sector) {
        filteredCompanies = filteredCompanies.filter(company =>
            company.sector.toLowerCase() === sector.toLowerCase()
        );
    }

    res.json(filteredCompanies);
});

app.get('/api/companies/:symbol', (req, res) => {
    const company = companies.find(c => c.symbol === req.params.symbol);
    if (!company) {
        return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
        ...company,
        financials: {
            revenue: '383.3B',
            netIncome: '97.0B',
            eps: '6.16',
            peRatio: '28.5'
        },
        recentEvents: [
            {
                id: '1',
                title: 'Q4 2024 Earnings Call',
                date: new Date(),
                type: 'earnings'
            }
        ]
    });
});

// Watchlist Routes
app.get('/api/watchlists', authenticateToken, (req, res) => {
    const userWatchlists = watchlists.filter(w => w.userId === req.user.id);
    res.json(userWatchlists);
});

app.post('/api/watchlists', authenticateToken, (req, res) => {
    const { name, companies: watchlistCompanies } = req.body;

    const watchlist = {
        id: Date.now().toString(),
        userId: req.user.id,
        name,
        companies: watchlistCompanies || [],
        createdAt: new Date()
    };

    watchlists.push(watchlist);
    res.status(201).json(watchlist);
});

app.put('/api/watchlists/:id', authenticateToken, (req, res) => {
    const watchlistIndex = watchlists.findIndex(w => 
        w.id === req.params.id && w.userId === req.user.id
    );

    if (watchlistIndex === -1) {
        return res.status(404).json({ error: 'Watchlist not found' });
    }

    const { name, companies: watchlistCompanies } = req.body;
    watchlists[watchlistIndex] = {
        ...watchlists[watchlistIndex],
        name: name || watchlists[watchlistIndex].name,
        companies: watchlistCompanies || watchlists[watchlistIndex].companies
    };

    res.json(watchlists[watchlistIndex]);
});

app.delete('/api/watchlists/:id', authenticateToken, (req, res) => {
    const watchlistIndex = watchlists.findIndex(w => 
        w.id === req.params.id && w.userId === req.user.id
    );

    if (watchlistIndex === -1) {
        return res.status(404).json({ error: 'Watchlist not found' });
    }

    watchlists.splice(watchlistIndex, 1);
    res.json({ message: 'Watchlist deleted successfully' });
});

// Alerts Routes
app.get('/api/alerts', authenticateToken, (req, res) => {
    const userAlerts = alerts.filter(a => a.userId === req.user.id);
    res.json(userAlerts);
});

app.post('/api/alerts', authenticateToken, (req, res) => {
    const { type, symbol, condition, value, description } = req.body;

    const alert = {
        id: Date.now().toString(),
        userId: req.user.id,
        type,
        symbol,
        condition,
        value,
        description,
        status: 'active',
        createdAt: new Date(),
        triggeredAt: null
    };

    alerts.push(alert);
    res.status(201).json(alert);
});

app.delete('/api/alerts/:id', authenticateToken, (req, res) => {
    const alertIndex = alerts.findIndex(a => 
        a.id === req.params.id && a.userId === req.user.id
    );

    if (alertIndex === -1) {
        return res.status(404).json({ error: 'Alert not found' });
    }

    alerts.splice(alertIndex, 1);
    res.json({ message: 'Alert deleted successfully' });
});

// Events Routes
app.get('/api/events', (req, res) => {
    const { status, company } = req.query;
    let filteredEvents = events;

    if (status) {
        filteredEvents = filteredEvents.filter(e => e.status === status);
    }

    if (company) {
        filteredEvents = filteredEvents.filter(e => e.company === company);
    }

    res.json(filteredEvents);
});

app.get('/api/events/:id', (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
        ...event,
        transcript: {
            segments: [
                {
                    speaker: 'Tim Cook',
                    time: '00:01:30',
                    text: 'Good afternoon, and thank you for joining us today.'
                },
                {
                    speaker: 'Luca Maestri',
                    time: '00:02:15',
                    text: 'Our revenue for Q4 was $94.9 billion, up 8% year over year.'
                }
            ]
        }
    });
});

// Search Routes
app.get('/api/search', (req, res) => {
    const { q, type } = req.query;
    const results = [];

    if (!q) {
        return res.json({ results: [], total: 0 });
    }

    // Search companies
    if (!type || type === 'companies') {
        const companyResults = companies.filter(company =>
            company.name.toLowerCase().includes(q.toLowerCase()) ||
            company.symbol.toLowerCase().includes(q.toLowerCase())
        ).map(company => ({
            type: 'company',
            id: company.symbol,
            title: company.name,
            subtitle: company.symbol,
            data: company
        }));
        results.push(...companyResults);
    }

    // Search events
    if (!type || type === 'events') {
        const eventResults = events.filter(event =>
            event.title.toLowerCase().includes(q.toLowerCase()) ||
            event.company.toLowerCase().includes(q.toLowerCase())
        ).map(event => ({
            type: 'event',
            id: event.id,
            title: event.title,
            subtitle: `${event.company} • ${event.type}`,
            data: event
        }));
        results.push(...eventResults);
    }

    res.json({
        results: results.slice(0, 50),
        total: results.length,
        query: q
    });
});

// Analytics Routes
app.get('/api/analytics/dashboard', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    const userWatchlists = watchlists.filter(w => w.userId === req.user.id);
    const userAlerts = alerts.filter(a => a.userId === req.user.id);

    res.json({
        stats: {
            eventsAttended: user.stats.eventsAttended || 156,
            companiesFollowed: user.stats.companiesFollowed || 47,
            hoursListened: user.stats.hoursListened || 89,
            searchesMade: user.stats.searchesMade || 234
        },
        topInterests: [
            { name: 'Technology', percentage: 67 },
            { name: 'Finance', percentage: 23 },
            { name: 'Healthcare', percentage: 10 }
        ],
        recentActivity: [
            {
                type: 'event',
                title: 'Joined Apple Q4 2024 Earnings Call',
                description: 'Listened for 58 minutes, saved transcript',
                time: '2 hours ago'
            },
            {
                type: 'watchlist',
                title: 'Added Microsoft to Tech Giants watchlist',
                description: 'Now following 12 companies in this watchlist',
                time: '5 hours ago'
            }
        ]
    });
});

// Real-time price updates (simulate)
const updatePrices = () => {
    companies.forEach(company => {
        const changePercent = (Math.random() - 0.5) * 0.1; // ±5% max change
        const newPrice = company.price * (1 + changePercent);
        const change = newPrice - company.price;
        
        company.price = Math.round(newPrice * 100) / 100;
        company.change = Math.round(change * 100) / 100;
        company.changePercent = Math.round(changePercent * 10000) / 100;
    });
};

// Update prices every 30 seconds
setInterval(updatePrices, 30000);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 ATNT Backend Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});