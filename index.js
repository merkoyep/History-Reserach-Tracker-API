const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const Handlebars = require('handlebars');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const { engine } = require('express-handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
      eq: (v1, v2) => v1 === v2,
    },
  })
);
app.set('view engine', 'handlebars');

function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.sendStatus(401); // if there's no token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JQT Verification Error:', err);
      return res.sendStatus(403); // if the token is invalid or expired
    }
    req.user = decoded;
    next();
  });
}
function optionalAuthenticateToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return next(); // No token present, continue without setting req.user
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      req.user = decoded;
    }
    next(); // Continue regardless of token validity
  });
}

app.use(optionalAuthenticateToken);
// Set currentUser

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

// Example of a protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.send(`Hello, your ID is ${req.user.id}`);
});

app.get('/', async (req, res) => {
  res.render('home');
});

app.get('/dashboard', authenticateToken, async (req, res) => {
  const citations = await prisma.citation.findMany();
  const sources = await prisma.source.findMany();
  res.render('dashboard', { sources: sources, citations: citations });
});

// Controllers

require('./controllers/auth')(app, prisma);
require('./controllers/source')(app, prisma, authenticateToken);
require('./controllers/citation')(app, prisma, authenticateToken);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
