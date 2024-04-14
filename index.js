const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const Handlebars = require('handlebars');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();

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
  })
);
app.set('view engine', 'handlebars');

function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    console.log('No token provided.');
    return res.sendStatus(401); // if there's no token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT verification error:', err);
      return res.sendStatus(403); // if the token is invalid or expired
    }
    console.log('JWT decoded successfully:', decoded);
    req.user = decoded;
    next();
  });
}
app.use(authenticateToken);
// Set currentUser

app.use((req, res, next) => {
  console.log('Check if user object exists:', req.user); // Debugging: Check if the user object is available
  if (req.user && req.user.id) {
    prisma.user
      .findUnique({
        where: {
          id: req.user.id,
        },
      })
      .then((currentUser) => {
        console.log('User found:', currentUser);
        if (currentUser) {
          res.locals.currentUser = currentUser;
        } else {
          console.log('User not found in database');
        }
        next();
      })
      .catch((err) => {
        console.log('Error accessing the database:', err);
        next();
      });
  } else {
    console.log('No user information available to find in the database');
    next();
  }
});

// Example of a protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.send(`Hello, your ID is ${req.user.id}`);
});

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

// Controllers

require('./controllers/auth')(app, prisma);
require('./controllers/source')(app, prisma);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
