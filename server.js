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
const User = require('./models/user.js')
const Match = require('./models/match.js')
const Conversation = require('./models/conversation.js')
const Message = require('./models/message.js')

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
app.use(indexRouter);
app.use(usersRouter);
app.use(postRouter)

// const newUser = new User({
//   name: "Nick Black",
//   email: "johndoe@example.com",
//   password: "password",
//   username: "NickB93",
//   server: ['EU'],
//   roles: ["dps"],
//   content: ["dungeon"],
// });

// newUser.save().then(() => {
//   console.log('User created successfully!');
// }).catch((error) => {
//   console.error('Failed to create user:', error);
// });


// Ensuring the server is listening to the port
app.listen(port, () => console.log(`Backend listening on port:${port}`))