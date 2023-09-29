const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

//user: eliteAdmin
//pass :kz7fQgCtjVgoPNYn

const uri =
  "mongodb+srv://eliteAdmin:kz7fQgCtjVgoPNYn@cluster0.guksi.mongodb.net/elite-dwell-assist?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const maidCollection = client.db("elite-dwell-assist").collection("maid");

    //maid post
    app.post("/maid", async (req, res) => {
      const maid = req.body;
      const result = await maidCollection.insertOne(maid);
      if (result.insertedCount === 1) {
        res.send(result);
        res.status(201).json({ message: "Maid added successfully" });
      } else {
        res.status(500).json({ message: "Failed to add maid" });
      }
    });

    //maid get
    app.get("/maid", async (req, res) => {
      const query = {};
      const cursor = maidCollection.find(query);
      const maids = await cursor.toArray();
      res.send(maids);
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
