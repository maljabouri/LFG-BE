// Import Dependencies
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
// const passport = require('passport')
// const jwt = require('jsonwebtoken')
const db = require('./config/db')


// Instantitate DB connection 
mongoose.connect(db, {useNewUrlParser : true})

// Log on first connection
mongoose.connection.once('open', () => console.log('Connected to MongoDB-LFG'))


//Require Route Files
const usersRouter = require('./routes/users.js')
const matchRouter = require('./routes/matches.js')
const conversationRouter = require('./routes/conversations.js')
const messageRouter = require('./routes/messages.js')

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

// passport.use(strategy);
/** 
 * Routes
 * 
 * Mount imported Routers
*/
// app.use(indexRouter);
app.use(usersRouter);
app.use(matchRouter)
app.use(conversationRouter)
app.use(messageRouter)




// Ensuring the server is listening to the port
app.listen(port, () => console.log(`Backend listening on port:${port}`))