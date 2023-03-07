// Import Dependencies
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const db = require('./config/db')


// Instantitate DB connection 
mongoose.connect(db, {useNewUrlParser : true})

// Log on first connection
mongoose.connection.once('open', () => console.log('Connected to MongoDB'))


//Require Route Files
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const postRouter = require('./routes/posts')

// Instantiate express server object 
const app = express()

// Define port
const port = process.env.Port || 5001
const reactPort = 3000;
   
// Middleware -
//  Converts JSON to Javacript Object
app.use(express.json())
app.use(express.static("."));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${reactPort}`}))

passport.use(strategy);
/** 
 * Routes
 * 
 * Mount imported Routers
*/
app.use(indexRouter);
app.use(usersRouter);
app.use(postRouter)

// Ensuring the server is listening to the port
app.listen(port, () => console.log(`Backend listening on port:${port}`))