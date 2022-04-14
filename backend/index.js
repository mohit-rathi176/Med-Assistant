const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
// const session = require("express-session");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

// app.use(cookieParser());
// app.use(session({
//   secret: 'MedAssistant',
//   saveUninitialized: false,
//   resave: false
// }));

// Import Routes
const authRoute = require('./routes/auth');
const doctRoute = require('./routes/doctor');

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/api/user', authRoute);
app.use('/api/doctor', doctRoute);

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
    console.log("Connected to MongoDB!");
});

// Home route
app.get('/', (req, res) => {
    res.send('Home Page');
});

// 404: no matching route

// Listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on Port: ${port}`);
});
