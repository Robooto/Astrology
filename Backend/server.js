const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// routes
const scopesController = require('./controllers/scopes.controller');

app.use(cors());
app.use(bodyParser.json());

// add routes
app.use('/scopes', scopesController);

app.listen(3000, () => console.log(`app running on port 3000`));

// for our tests
module.exports = app; 
