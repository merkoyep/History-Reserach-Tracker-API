const { PrismaClient } = require('@prisma/client');
const request = require('supertest');
const setupTestApp = require('../config/setup.js'); // Import the setup function
const { authenticateTokenTesting } = require('../middleware.js');
const prisma = new PrismaClient();

describe('Test Source Routes', () => {
  let app;
  let token; // Correctly declare token

  beforeAll(async () => {
    app = setupTestApp();
    app.use(authenticateTokenTesting);
    require('../controllers/source.js')(app, prisma, authenticateTokenTesting); // Load your routes
  });
  beforeEach(async () => {});

  test('GET /source - should return source page', async () => {
    const response = await request(app).get('/source');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Add Source');
  });

  test('GET /source/new - should return new source form', async () => {
    const response = await request(app).get('/source/new');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<legend>"Add new source"</legend>');
  });

  test('GET /source/1 - should return source details', async () => {
    await prisma.source.create({
      data: {
        id: 1,
        title: 'Source1',
        authorFirstName: 'Jane',
        authorLastName: 'Doe',
        publishDate: new Date('2024-05-05T12:00:00Z').toISOString(),
        publishedBy: 'wikipedia',
        userId: 1,
      },
    });
    const source = await prisma.source.findUnique({
      where: { id: 1 },
    });
    console.log(source);
    const response = await request(app).get('/source/1');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<h2>Source Information</h2>');
  });
});
