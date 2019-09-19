// setup express
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// configure template engine and views
app.set('views', './views');
app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// configure path for static, middleware, and controllers
app.use(express.static(path.join(__dirname, '/public')));
app.use(require('./controllers/users.js'));

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});