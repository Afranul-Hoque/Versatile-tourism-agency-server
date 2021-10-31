const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000

// using middle wear
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bldso.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected')

        const database = client.db("TourismAgency");
        const allService = database.collection("service");
        const newService = database.collection("userService")

        // post api start

        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log('hit the post');
            const result = await allService.insertOne(service);
            res.json(result)
        })



        // user info submit 
        app.post('/userService', async (req, res) => {
            const userservice = req.body;
            console.log('hit the post');
            const newresult = await newService.insertOne(userservice);
            res.json(newresult)
        })


        // get single services

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('hit him', id);
            const query = { _id: ObjectId(id) };
            const service = await allService.findOne(query);
            res.json(service);
        })
        // get all data

        app.get('/services', async (req, res) => {
            const cursor = allService.find({});
            const services = await cursor.toArray();
            res.send(services)
        })


        // get user info

        app.get('/userService', async (req, res) => {
            const usecursor = newService.find({});
            const details = await usecursor.toArray();
            res.send(details)
        })

        // user info delete

        app.delete('/userService/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId };
            const result = await newService.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('hello world');
})

app.listen(port, () => {
    console.log('expale app listen', port)
})

