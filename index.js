const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nma65uq.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    
  await client.connect(); 
    
    const db = client.db('bookDB');
    const courseCollection = db.collection('courses')
   

/* all books using GET request */
    app.get('/courses', async (req, res)=>{
        const result = await courseCollection.find().toArray();
      

        res.send(result)

    })

app.get('/courses/:id', async (req, res)=>{

    const {id} = req.params;
    const result = await courseCollection.findOne({_id: new ObjectId(id)});

    res.send(result)

})


/* add book using POST request */

app.post('/courses', async (req, res) =>{
    const newCourse = req.body;
    
    const result = await courseCollection.insertOne(newCourse)
    res.send(result)
})

//  DELETE a course by ID
app.delete("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await courseCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Course not found" });
    }

    res.send({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).send({ message: "Failed to delete course" });
  }
});


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    /* await client.close(); */
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})