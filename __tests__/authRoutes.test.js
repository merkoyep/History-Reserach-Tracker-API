const request = require('supertest');
const setupTestApp = require('../config/setup.js'); // Import the setup function

describe('Test Auth Routes', () => {
  let app;

  beforeAll(() => {
    app = setupTestApp(); // Setup the app before all tests
    require('../controllers/auth.js')(app); // Load your routes
  });

  test('GET /signup - should return Signup Page', async () => {
    const response = await request(app).get('/signup');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<legend>Sign Up</legend>');
  });

  test('GET /login - should return Login Page', async () => {
    const response = await request(app).get('/login');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<legend>Login</legend>');
  });

  test('POST /signup - should fail without username', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ username: '', password: 'testpassword' });
    expect(response.statusCode).toBe(400);
    expect(response.text).toContain('Username is required');
  });

  test('POST /signup - should fail without password', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ username: 'testuser', password: '' });
    expect(response.statusCode).toBe(400);
    expect(response.text).toContain('Password is required');
  });
});
