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
      return res.sendStatus(403); // if the token is invalid or expired
    }
    req.user = decoded;
    next();
  });
}
// Set currentUser

app.use((req, res, next) => {
  if (req.user && req.user.id) {
    prisma.user
      .findUnique({
        where: {
          id: req.user.id,
        },
      })
      .then((currentUser) => {
        if (currentUser) {
          res.locals.currentUser = currentUser;
        } else {
        }
        next();
      })
      .catch((err) => {
        next();
      });
  } else {
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
