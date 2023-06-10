const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.scmnlyp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const instructorsCollection = client.db("linguaDb").collection("instructors");
        const classesCollection = client.db("linguaDb").collection("classes");
        const enrolledCollection = client.db("linguaDb").collection("enrolled");

        app.get('/instructors', async (req, res) => {
            const result = await instructorsCollection.find().toArray();
            res.send(result);
        })

        app.get('/classes', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
        })

        //enrolled collection
        app.get('/enrolled', async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send(result);
            }
            const query = { email: email };
            const result = await enrolledCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/enrolled', async (req, res) => {
            const classItem = req.body;
            console.log(classItem);
            const result = await enrolledCollection.insertOne(classItem);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`Lingua Camp is running on port ${port}`)
})