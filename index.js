const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const http = require("http");
const { ObjectId } = require("mongodb");
const WebSocket = require("ws");
const app = express();
const port = process.env.PORT || 5000;

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

// // WebSocket setup
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// wss.on("connection", (ws) => {
//   console.log("WebSocket connected");

//   ws.on("message", (message) => {
//     console.log(`Received: ${message}`);
//   });

//   ws.on("close", () => {
//     console.log("WebSocket disconnected");
//   });
// });
// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// wss.on("connection", (ws, req) => {
//   console.log("WebSocket connected");
//   const maidId = parseMaidIdFromRequest(req);

//   ws.maidId = maidId;
// });

async function run() {
  try {
    await client.connect();
    const customerCollection = client
      .db("elite-dwell-assist")
      .collection("customer");
    const maidCollection = client.db("elite-dwell-assist").collection("maid");

    const bookingCollection = client
      .db("elite-dwell-assist")
      .collection("bookings");

    //customer post
    app.post("/customer", async (req, res) => {
      const customer = req.body;
      const result = await customerCollection.insertOne(customer);
      if (result.insertedCount === 1) {
        res.send(result);
        res.status(201).json({ message: "Customer added successfully" });
      } else {
        res.status(500).json({ message: "Failed to add customer" });
      }
    });

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
    // bookings
    app.post("/bookings", async (req, res) => {
      try {
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking);
        if (result.insertedCount === 1) {
          // wss.clients.forEach((client) => {
          //   if (
          //     client.readyState === WebSocket.OPEN &&
          //     client.maidId === booking.maidId
          //   ) {
          //     client.send(
          //       JSON.stringify({
          //         type: "booking",
          //         message: `You have a new booking request from ${booking.customerName}`,
          //       })
          //     );
          //   }
          // });
          console.log(result);
          res.status(201).json({ message: "Booking created successfully" });
        } else {
          res.status(500).json({ message: "Failed to create booking" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create booking" });
      }
    });

    // ...

    // individual booking information by _id
    app.get("/bookings/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid ObjectId" });
        }
        const query = { _id: new ObjectId(id) };
        const booking = await bookingCollection.findOne(query);
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }
        res.json(booking);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // individual booking information by maidId
    // app.get("/bookings/:maidId", async (req, res) => {
    //   try {
    //     const maidId = req.params.maidId;
    //     const query = { maidId };
    //     const cursor = bookingCollection.find(query);
    //     const bookings = await cursor.toArray();
    //     res.send(bookings);
    //   } catch (error) {
    //     console.error(error);
    //     res
    //       .status(500)
    //       .json({ message: "Failed to fetch individual booking information" });
    //   }
    // });

    // bookings
    app.get("/bookings", async (req, res) => {
      const query = {
        maidId: req.query.maidId,
        customerName: req.query.customerName,
      };
      const cursor = bookingCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    // const maidNotifications = {}; // Create an object to store notifications for each maid

    // wss.on("connection", (ws, req) => {
    //   console.log("WebSocket connected");
    //   const maidId = parseMaidIdFromRequest(req);
    //   ws.maidId = maidId;
    //   maidNotifications[maidId] = [];
    //   // Send existing notifications to the maid when they connect
    //   ws.send(
    //     JSON.stringify({
    //       type: "notifications",
    //       data: maidNotifications[maidId],
    //     })
    //   );
    // });

    //customer get
    app.get("/customer", async (req, res) => {
      const query = {};
      const cursor = customerCollection.find(query);
      const customers = await cursor.toArray();
      res.send(customers);
    });

    //maid get
    app.get("/maid", async (req, res) => {
      const query = {};
      const cursor = maidCollection.find(query);
      const maids = await cursor.toArray();
      res.send(maids);
    });

    // maid individual get
    app.get("/getMaidId/:bookingId", async (req, res) => {
      const bookingId = req.params.bookingId;
      const maidId = await fetchMaidId(bookingId);
      res.json({ maidId });
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
