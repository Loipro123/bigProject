const express = require('express');
const connectDB = require('./config/db');
const app = express();
// const cors = require('cors');
// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }

// Connect DB
connectDB()
/// Init Middleware

// app.use(cors(corsOptions));
app.use(express.json({extended: false}))

app.get('/',(req,res) => res.send('API Running'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/product', require('./routes/api/product'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/checkout', require('./routes/api/stripe'));


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));