const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = 5000

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

        // post api start

        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log('hit the post');
            const result = await allService.insertOne(service);
            res.json(result)
        })

        // get all data

        app.get('/services', async (req, res) => {
            const cursor = allService.find({});
            const services = await cursor.toArray();
            res.send(services)
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

