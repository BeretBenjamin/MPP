/*const express = require('express');
const router = express.Router();
const faker = require('faker');

function generateHouses(num) {
    let houses = [];
    for (let i = 1; i <= num; i++) {
        houses.push({
            id: i.toString(),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            price: faker.random.number({ min: 50000, max: 500000 }),
            size: faker.random.number({ min: 500, max: 5000 })
        });
    }
    return houses;
}

let houses = generateHouses(20);

router.get('/', (req, res, next) => {
    const houseArray = houses.map(house => ({
        id: house.id,
        address: house.address,
        city: house.city,
        price: house.price,
        size: house.size
    }));
    res.status(200).json(houseArray);
});

router.post('/', (req, res, next) => {
    const house = {
        id: houses.length + 1,
        address: req.body.address,
        city: req.body.city,
        price: parseInt(req.body.price),
        size: parseInt(req.body.size)
    };
    houses.push(house);
    res.status(201).json({
        message: "House added successfully",
        createdHouse: house
    });
});

router.put('/:houseId', (req, res, next) => {
    const id = req.params.houseId;
    const foundHouse = houses.find(house => house.id === id);
    if (foundHouse) {
        foundHouse.address = req.body.address;
        foundHouse.city = req.body.city;
        foundHouse.price = parseInt(req.body.price);
        foundHouse.size = parseInt(req.body.size);
        res.status(200).json({
            message: `House ${id} updated`,
            updatedHouse: foundHouse
        });
    } else {
        res.status(404).json({
            message: `House ${id} not found`
        });
    }
});

router.delete('/:houseId', (req, res, next) => {
    const id = req.params.houseId;
    const index = houses.findIndex(house => house.id === id);
    if (index !== -1) {
        houses.splice(index, 1);
        res.status(200).json({
            message: `Deleted house ${id}`
        });
    } else {
        res.status(404).json({
            message: `House ${id} not found`
        });
    }
});

router.get('/:houseId', (req, res, next) => {
    const id = req.params.houseId;
    const foundHouse = houses.find(house => house.id === id);
    if (foundHouse) {
        res.status(200).json(foundHouse);
    } else {
        res.status(404).json({
            message: `House ${id} not found`
        });
    }
});

module.exports = router;*/

const express = require('express');
const router = express.Router();
const { MongoClient, ObjectID, ObjectAddress } = require('mongodb');

// Connection URI for MongoDB Atlas
const uri = 'mongodb+srv://beretbenjamin12:nqARCOO1opn8DFD8@cluster.rtazod5.mongodb.net/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas', err);
    }
}

connectToDatabase();

//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const collection = client.db('fishApp').collection('houses');

router.get('/', async (req, res, next) => {
    try {
        const houses = await collection.find().toArray();
        res.status(200).json(houses);
    } catch (err) {
        console.error('Error retrieving documents from houses collection:', err);
        res.status(500).json({ error: err });
    }
});

router.post('/', async (req, res, next) => {
    const house = {
        address: req.body.address,
        city: req.body.city,
        price: parseInt(req.body.price),
        size: parseInt(req.body.size),
        fishId: parseInt(req.body.fishID)
    };

    try {
        const result = await collection.insertOne(house);
        console.log('Insert result:', result);
        if (result.acknowledged && result.ops && result.ops.length > 0) {
            res.status(201).json({
                message: "House added successfully",
                createdHouse: result.ops[0]
            });
        } else {
            console.error('Error inserting document into houses collection:', result);
            res.status(500).json({ error: 'Error inserting document into houses collection' });
        }
    } catch (err) {
        console.error('Error inserting document into houses collection:', err);
        res.status(500).json({ error: err.message });
    }
});



router.put('/:houseId', async (req, res, next) => {
    const id = req.params.houseId;
    const filter = { _id: new ObjectID(id) };
    const update = {
        $set: {
            address: req.body.address,
            city: req.body.city,
            price: parseInt(req.body.price),
            size: parseInt(req.body.size)
        }
    };

    try {
        const result = await collection.updateOne(filter, update);
        if (result.matchedCount === 0) {
            res.status(404).json({
                message: `House ${id} not found`
            });
        } else {
            res.status(200).json({
                message: `House ${id} updated`
            });
        }
    } catch (err) {
        console.error('Error updating document in houses collection:', err);
        res.status(500).json({ error: err });
    }
});

router.delete('/:houseId', async (req, res, next) => {
    const id = req.params.houseId;
    const filter = { _id: new ObjectID(id) };

    try {
        const result = await collection.deleteOne(filter);
        if (result.deletedCount === 0) {
            res.status(404).json({
                message: `House ${id} not found`
            });
        } else {
            res.status(200).json({
                message: `Deleted house ${id}`
            });
        }
    } catch (err) {
        console.error('Error deleting document from houses collection:', err);
        res.status(500).json({ error: err });
    }
});

router.get('/:houseAddress', async (req, res, next) => {
    const address = req.params.houseAddress;
    const filter = { address: address };

    try {
        const house = await collection.findOne(filter);
        if (house) {
            res.status(200).json(house);
        } else {
            res.status(404).json({
                message: `House ${address} not found`
            });
        }
    } catch (err) {
        console.error('Error retrieving document from houses collection:', err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;
