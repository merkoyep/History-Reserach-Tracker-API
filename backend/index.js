const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const Handlebars = require('handlebars');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const cors = require('cors');
const {
  authenticateToken,
  optionalAuthenticateToken,
} = require('./middleware.js');
app.use(
  cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const { engine } = require('express-handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
app.use((req, res, next) => {
  if (req.user && req.user.id) {
    prisma.user
      .findUnique({
        where: { id: req.user.id },
      })
      .then((currentUser) => {
        if (currentUser) {
          res.locals.currentUser = currentUser;
        }
        next();
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
        next();
      });
  } else {
    next(); // No user found in token, proceed without setting currentUser
  }
});
// app.engine(
//   'handlebars',
//   engine({
//     defaultLayout: 'main',
//     handlebars: allowInsecurePrototypeAccess(Handlebars),
//     helpers: {
//       eq: (v1, v2) => v1 === v2,
//     },
//   })
// );
// Removed to use React
// app.set('view engine', 'handlebars');
// Example of a protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.send(`Hello, your ID is ${req.user.id}`);
});

app.get('/', async (req, res) => {
  res.redirect('/');
});

app.get('/dashboard', authenticateToken, async (req, res) => {
  const citations = await prisma.citation.findMany();
  const sources = await prisma.source.findMany();
  res.json({ sources: sources, citations: citations });
});
app.get('/api/check-auth', (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(200).json({ isAuthenticated: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(200).json({ isAuthenticated: false });
    }
    return res.status(200).json({ isAuthenticated: true, user: decoded });
  });
});

// Controllers

require('./controllers/auth')(app, prisma);
require('./controllers/source')(app, prisma, authenticateToken);
require('./controllers/citation')(app, prisma, authenticateToken);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.use(optionalAuthenticateToken);
// Set currentUser

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
