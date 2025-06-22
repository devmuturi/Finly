const express = require('express');
const morgan = require('morgan');
const path = require('node:path');

const app = express();

// Add css
app.use(express.static(path.join(__dirname, 'public')));

// app.set('views', './views');
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('index', { message: 'Hello from Node.js'})
})

app.get('/contact', (req, res) => {
    res.render('index', { message: 'The Contact Page'})
});

app.get('/about', (req, res) => {
    res.render('index', { message: 'The About Page'})
});

app.get((req, res) => {
  res.status(404).render('index', { message: 'Not Found' })
})

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})