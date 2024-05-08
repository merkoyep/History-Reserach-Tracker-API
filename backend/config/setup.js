// File: test/setup.js

const express = require('express');
const { engine } = require('express-handlebars');
const {
  authenticateToken,
  optionalAuthenticateToken,
} = require('../middleware.js');
// This function will configure an express app with Handlebars
function setupTestApp() {
  const app = express();
  app.use(express.json());

  // Set up Handlebars as the view engine
  app.use(optionalAuthenticateToken);
  app.engine(
    'handlebars',
    engine({
      defaultLayout: 'main', // Ensure this layout exists in your views/layouts/
      extname: '.handlebars', // Use this if you are using '.handlebars' extensions
    })
  );
  app.set('view engine', 'handlebars');
  app.set('views', './views'); // Point to your views directory

  return app;
}

module.exports = setupTestApp;
