const express = require('express')
const morgan = require('morgan')
const path = require('node:path')
const userRouter = require('./routes/user.route')
const session = require('express-session')

require('dotenv').config()
require('./libs/dbConnect')

const app = express()

// Add css
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    // key used to sign in session and verify the cookie later
    secret: process.env.AUTH_SECRET,
    // both used to optimize the session storage
    saveUninitialized: true,
    resave: false,
  }),
)

// app.set('views', './views');
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// routes
app.get('/', (req, res) => {
  res.render('index', { message: 'Hello from Node.js' })
})

app.use('/users', userRouter)

app.get('/contact', (req, res) => {
  res.render('index', { message: 'The Contact Page' })
})

app.get('/about', (req, res) => {
  res.render('index', { message: 'The About Page' })
})

app.get('/*splat', (req, res) => {
  res.status(404).render('index', { message: 'Not Found' })
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
