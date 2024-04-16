const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = [];

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

module.exports = function (app, prisma) {
  app.get('/signup', async (req, res) => {
    res.render('auth-signup');
  });
  app.get('/login', async (req, res) => {
    res.render('auth-login');
  });

  app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
      res.status(201).send('User registered');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (!user) {
        return res.status(401).send('Authentication failed');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Authentication failed');
      }

      const token = generateToken(user);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      res.send('Logged in successfully');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
};
