const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const multer = require("multer");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const { generateUniqueId } = require("./utils");

app.use(cors());
app.use(express.json());

//user: eliteAdmin
//pass :kz7fQgCtjVgoPNYn

const uri =
  "mongodb+srv://eliteAdmin:kz7fQgCtjVgoPNYn@cluster0.guksi.mongodb.net/elite-dwell-assist?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

const upload = multer({ storage: storage });

async function run() {
  try {
    await client.connect();
    const maidCollection = client.db("elite-dwell-assist").collection("maid");

    app.post("/maid", upload.single("image"), async (req, res) => {
      const {
        name,
        email,
        pass,
        phone,
        img,
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

      const newMaid = {
        maid_id: generateUniqueId(), // You need to implement generateUniqueId function to generate a unique ID
        name,
        email,
        pass,
        phone,
        img,
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
        res.json({ message: "Maid added successfully", data: result.ops[0] });
      } catch (error) {
        console.error("Error inserting maid:", error);
        res.status(500).json({ error: "Failed to add maid" });
      }
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
