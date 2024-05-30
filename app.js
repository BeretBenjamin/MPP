const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the MongoDB Node.js Driver
const { MongoClient } = require('mongodb');

// Connection URI for MongoDB Atlas
const uri = 'mongodb+srv://babtandayana2:aNJwWYa2y6xf9twm@cluster0.w7qgva7.mongodb.net/';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB Atlas
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas', err);
    }
}

connectToDatabase();

const fishRoutes = require('./api/routes/fish');
const houseRoutes = require('./api/routes/house'); // Import house routes

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use('/fish',fishRoutes);
app.use('/houses', houseRoutes); // Use house routes with base URL '/houses'


app.use((req,res,next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});

module.exports = app;