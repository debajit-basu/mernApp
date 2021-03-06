const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

// Init Middleware
app.use(express.json({ exteded: false }));


const PORT = process.env.PORT || 5000;

// Define routes

app.use('/api/users' , require('./routes/api/users'));
app.use('/api/auth' , require('./routes/api/auth'));
app.use('/api/posts' , require('./routes/api/posts'));
app.use('/api/profile' , require('./routes/api/profile'));


// app.get('/' , (req,res,next) => {
//     res.send('Welcome to express app');
// })



app.listen(PORT , () => {
    console.log('Server running at port no : ' + PORT);
})