/*const express = require('express');
const router = express.Router();
const faker = require('faker');


function generatepesti(num) {
    let peste = [];
    for (let i = 1; i <= num; i++) {
        peste.push({
            id: i.toString(),
            name: faker.random.word(),
            origin: faker.address.city(),
            species: "peste " + faker.random.word(),
            beauty_score: faker.random.float()
        
    });
    }
    
    return peste;
}
let Fish = generatepesti(24);

/*const Adrian={
    id:"2",
    name: "Adrian Corduneanu",
    origin:  "Iasi",
    species: "Peste Sportiv",
    beauty_score:9.8
};
//Fish.push(Adrian);

router.get('/', (req, res, next) => {
    const fishArray = Fish.map(fish => ({
        id: fish.id,
        name: fish.name,
        species: fish.species,
        origin: fish.origin,
        beauty_score: fish.beauty_score
    }));
    
    res.status(200).json(fishArray);
});

router.post('/',(req,res,next)=>{
    const fish = {
        id:parseInt(req.body.id),
        name:req.body.name,
        species:req.body.species,
        origin:req.body.origin,
        beauty_score:parseFloat(req.body.beauty_score)
    }
    Fish.push(fish);
    res.status(200).json({
        message: "peste added succesfully"
    });
});

router.put('/:fishId',(req,res,next)=>{
        const id = req.params.fishId;
        var found = false;
        for(var i = 0;i<Fish.length;++i){
            if(Fish[i].id == id){
                Fish[i].name = req.body.name;
                Fish[i].species = req.body.species;
                Fish[i].origin = req.body.origin;
                Fish[i].beauty_score = parseFloat(req.body.beauty_score);
                found = true;
            }
        }   
        if(!found){
            res.status(404).json({
                message: `peste ${id} not found`
            });
        }
        else{
            res.status(200).json({
                message: `peste ${id} updated`
            });
        }
});

router.delete('/:fishId',(req,res,next) =>{
    const id = req.params.fishId;
    for(var i = 0;i<Fish.length;++i){
        if(Fish[i].id == id){
            Fish.splice(i,1);
            res.status(200).json({
                message: `Deleted peste ${id}`
            });
        }
    }
});

router.get('/:fishId',(req,res,next) =>{
    const id = req.params.fishId;
    for(var i = 0;i<Fish.length;++i)
        if(Fish[i].id == id){
            res.status(200).json({
                id:Fish[i].id,
                name:Fish[i].name,
                species:Fish[i].species,
                origin:Fish[i].origin,
                beauty_score:Fish[i].beauty_score
            });
        }
});

module.exports = router;*/

const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

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

const collection = client.db('fishApp').collection('fish');

router.get('/', async (req, res, next) => {
    try {
        const fish = await collection.find().toArray();
        console.log('Fish:', fish); // Add this line for debugging
        res.status(200).json(fish);
    } catch (err) {
        console.error('Error retrieving documents from fish collection:', err);
        res.status(500).json({ error: err });
    }
});


router.post('/', async (req, res, next) => {
    const fish = {
        fishID: req.body.fishID,
        fishName: req.body.fishName,
        fishOrigin: req.body.fishOrigin,
        fishSpecies: req.body.fishSpecies,
        fishPericolScore: parseFloat(req.body.fishPericolScore)
    };

    try {
        const result = await collection.insertOne(fish);
        res.status(201).json({
            message: "Fish added successfully",
            createdFish: result.ops[0]
        });
    } catch (err) {
        console.error('Error inserting document into fish collection:', err);
        res.status(500).json({ error: err });
    }
});

router.put('/:fishId', async (req, res, next) => {
    const id = req.params.fishId;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: `Invalid fishId format`
        });
    }

    const filter = { _id: new ObjectId(id) };
    const update = {
        $set: {
            fishName: req.body.fishName,
            fishOrigin: req.body.fishOrigin,
            fishSpecies: req.body.fishSpecies,
            fishPericolScore: parseFloat(req.body.fishPericolScore)
        }
    };

    try {
        const result = await collection.updateOne(filter, update);
        if (result.matchedCount === 0) {
            res.status(404).json({
                message: `Fish ${id} not found`
            });
        } else {
            res.status(200).json({
                message: `Fish ${id} updated`
            });
        }
    } catch (err) {
        console.error('Error updating document in fish collection:', err);
        res.status(500).json({ error: err });
    }
});


router.delete('/:fishId', async (req, res, next) => {
    const id = req.params.fishId;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: `Invalid fishId format`
        });
    }

    const filter = { _id: new ObjectId(id) };

    try {
        const result = await collection.deleteOne(filter);
        if (result.deletedCount === 0) {
            res.status(404).json({
                message: `Fish ${id} not found`
            });
        } else {
            res.status(200).json({
                message: `Deleted fish ${id}`
            });
        }
    } catch (err) {
        console.error('Error deleting document from fish collection:', err);
        res.status(500).json({ error: err });
    }
});

router.get('/:fishId', async (req, res, next) => {
    const id = req.params.fishId;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: `Invalid fishId format`
        });
    }

    const filter = { _id: new ObjectId(id) };

    try {
        const fish = await collection.findOne(filter);
        if (fish) {
            res.status(200).json(fish);
        } else {
            res.status(404).json({
                message: `Fish ${id} not found`
            });
        }
    } catch (err) {
        console.error('Error retrieving document from fish collection:', err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;
