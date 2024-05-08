const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = [];
// Generates token based on user
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

module.exports = function (app, prisma) {
  //signup route
  app.get('/signup', async (req, res) => {
    res.render('auth-signup');
  });

  //login route
  app.get('/login', async (req, res) => {
    res.render('auth-login');
  });
  //logout route
  app.get('/logout', (req, res, next) => {
    res.clearCookie('jwt');
    return res.redirect('/');
  });
  //signup post route
  app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || username.trim() === '') {
      return res.status(400).send('Username is required');
    }
    if (!password || password.trim() === '') {
      return res.status(400).send('Password is required');
    }
    try {
      //devine hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
      res.status(201).json({
        user: { id: newUser.id, username: newUser.username },
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      //Query user
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (!user) {
        return res.status(401).send('Authentication failed');
      }
      //validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Authentication failed');
      }
      //asign token
      const token = generateToken(user);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      res.redirect('/sources');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
};
