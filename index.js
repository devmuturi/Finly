const express = require('express')
const morgan = require('morgan')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo') // Added for session storage
require('dotenv').config()

const userRouter = require('./routes/user.route')
const dashboardRouter = require('./routes/dashboard.route')
const { verifyUser } = require('./libs/middleware')
require('./libs/dbConnect')

const app = express()

// Middleware Configuration
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))

// Production Session Configuration
app.use(
  session({
    secret: process.env.AUTH_SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/finly',
      ttl: 14 * 24 * 60 * 60, // = 14 days
    }),
    resave: false,
    saveUninitialized: false, // Changed for production
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
    },
  }),
)

app.use(flash())

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Routes
app.use('/', userRouter)
app.use('/dashboard', verifyUser, dashboardRouter)

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found' })
})

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render('500', { title: 'Server Error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`,
  )
})
