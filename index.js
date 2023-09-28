const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { generateUniqueId } = require("./utils");

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

// Configure multer for file uploads with size limits
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB (adjust as needed)
  },
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

async function run() {
  try {
    await client.connect();
    const maidCollection = client.db("elite-dwell-assist").collection("maid");

    //maid post
    app.post("/maid", upload.single("image"), async (req, res) => {
      const {
        name,
        email,
        pass,
        phone,
        experience,
        task,
        salary,
        availability,
        location,
        nid_no,
        address,
        dob,
        gender,
        education,
      } = req.body;
      const imgData = req.file ? req.file.buffer.toString("base64") : null;

      const newMaid = {
        maid_id: generateUniqueId(),
        name,
        email,
        pass,
        phone,
        img: imgData,
        experience,
        task,
        salary,
        availability,
        location,
        nid_no,
        address,
        dob,
        gender,
        education,
      };

      try {
        const result = await maidCollection.insertOne(newMaid);
        if (result.insertedCount === 1) {
          // Successfully inserted, send a success response
          res.json({ message: "Maid added successfully", data: result.ops[0] });
        } else {
          // Failed to insert, send an error response
          res.status(500).json({ error: "Failed to add maid" });
        }
      } catch (error) {
        console.error("Error inserting maid:", error);
        res.status(500).json({ error: "Failed to add maid" });
      }
    });

    //maid get
    app.get("/maid", async (req, res) => {
      try {
        const maidCollection = client
          .db("elite-dwell-assist")
          .collection("maid");

        // Fetch all maids from the collection
        const maids = await maidCollection.find({}).toArray();

        res.json(maids);
      } catch (error) {
        console.error("Error fetching maids:", error);
        res.status(500).json({ error: "Failed to fetch maids" });
      }
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
