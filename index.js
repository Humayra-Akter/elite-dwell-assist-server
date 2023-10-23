const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://eliteAdmin:kz7fQgCtjVgoPNYn@cluster0.guksi.mongodb.net/elite-dwell-assist?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const customerCollection = client
      .db("elite-dwell-assist")
      .collection("customer");
    const adminCollection = client.db("elite-dwell-assist").collection("admin");
    const userCollection = client.db("elite-dwell-assist").collection("user");
    const maidCollection = client.db("elite-dwell-assist").collection("maid");
    const acknowledgeBookingCollection = client
      .db("elite-dwell-assist")
      .collection("maidPerDayAcknowledgeBooking");
    const reviewCollection = client
      .db("elite-dwell-assist")
      .collection("review");
    const customerBookedCollection = client
      .db("elite-dwell-assist")
      .collection("customerBooking");
    const driverCollection = client
      .db("elite-dwell-assist")
      .collection("driver");
    const maidSearchPostCollection = client
      .db("elite-dwell-assist")
      .collection("maidSearchPost");
    const perDayMaidBookingCollection = client
      .db("elite-dwell-assist")
      .collection("perDayMaidBooking");
    const tvBillCollection = client
      .db("elite-dwell-assist")
      .collection("tvBill");
    const bookingCollection = client
      .db("elite-dwell-assist")
      .collection("bookings");

    // admin post
    app.post("/admin", async (req, res) => {
      const admin = req.body;
      const result = await adminCollection.insertOne(admin);
      if (result.insertedCount === 1) {
        res.status(201).json({ message: "Admin added successfully" });
      } else {
        res.status(500).json({ message: "Failed to add admin" });
      }
    });

    // user post
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      if (result.insertedCount === 1) {
        res.status(201).json({ message: "User added successfully" });
      } else {
        res.status(500).json({ message: "Failed to add user" });
      }
    });

    // driver post
    app.post("/driver", async (req, res) => {
      const driver = req.body;
      const result = await driverCollection.insertOne(driver);
      if (result.insertedCount === 1) {
        res.status(201).json({ message: "Driver added successfully" });
      } else {
        res.status(500).json({ message: "Failed to add user" });
      }
    });

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

    //maid per day acknowledgeBooking post
    app.post("/acknowledgeBooking", async (req, res) => {
      const bookingId = req.body;
      const result = await acknowledgeBookingCollection.insertOne(bookingId);
      if (result.insertedCount === 1) {
        const deleteResult = await perDayMaidBookingCollection.deleteOne({
          _id: booking._id,
        });
        res.send(result);
        res.status(201).json({ message: "Maid added successfully" });
      } else {
        res.status(500).json({ message: "Failed to add maid" });
      }
    });

    //acknowledgeBooking get
    app.get("/acknowledgeBooking", async (req, res) => {
      const query = {};
      const cursor = acknowledgeBookingCollection.find(query);
      const acknowledgeBooking = await cursor.toArray();
      res.send(acknowledgeBooking);
    });

    // maidSearchPost
    app.post("/maidSearchPost", async (req, res) => {
      try {
        const postData = req.body;
        const result = await maidSearchPostCollection.insertOne(postData);

        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Booking saved successfully" });
        } else {
          res.status(500).json({ message: "Failed to save booking" });
        }
      } catch (error) {
        console.error("Booking error:", error);
      }
    });

    // perDayMaidBookings
    app.post("/perDayMaidBookings", async (req, res) => {
      try {
        const bookingData = req.body;
        const result = await perDayMaidBookingCollection.insertOne(bookingData);

        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Booking saved successfully" });
        } else {
          res.status(500).json({ message: "Failed to save booking" });
        }
      } catch (error) {
        console.error("Booking error:", error);
      }
    });

    // tvBill
    app.post("/tvBill", async (req, res) => {
      try {
        const bookingData = req.body;
        const result = await tvBillCollection.insertOne(bookingData);

        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Booking saved successfully" });
        } else {
          res.status(500).json({ message: "Failed to save booking" });
        }
      } catch (error) {
        console.error("Booking error:", error);
      }
    });

    //tvBill get
    app.get("/tvBill", async (req, res) => {
      const query = {};
      const cursor = tvBillCollection.find(query);
      const tvBill = await cursor.toArray();
      res.send(tvBill);
    });f

    //review post
    app.post("/reviews", async (req, res) => {
      try {
        const { userEmail, maidId, rating, reviewText } = req.body;
        const existingReview = await reviewCollection.findOne({
          userEmail,
          maidId,
        });
        if (existingReview) {
          res
            .status(400)
            .json({ message: "You have already reviewed this maid." });
          return;
        }
        const result = await reviewCollection.insertOne({
          userEmail,
          maidId,
          rating,
          reviewText,
        });

        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Review submitted successfully" });
        } else {
          res.status(500).json({ message: "Failed to submit review" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to submit review" });
      }
    });

    //review get
    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // bookings
    app.post("/bookings", async (req, res) => {
      try {
        const booking = req.body;
        booking.createdDate = new Date();
        const result = await bookingCollection.insertOne(booking);
        if (result.insertedCount === 1) {
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

    // Delete a booking by ID
    app.delete("/bookings/:id", async (req, res) => {
      try {
        const bookingId = req.params.id;
        const objectId = new ObjectId(bookingId);
        const result = await bookingCollection.deleteOne({ _id: objectId });
        if (result.deletedCount === 1) {
          res.json({ message: "Booking deleted successfully" });
        } else {
          res.status(404).json({ message: "Booking not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // bookings from maid to customer
    app.post("/customerBooked", async (req, res) => {
      try {
        const booking = req.body;
        const result = await customerBookedCollection.insertOne(booking);
        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Booking created successfully" });
        } else {
          res.status(500).json({ message: "Failed to create booking" });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // individual booking information by email
    app.get("/bookings/:email", async (req, res) => {
      try {
        const maidEmail = req.params.email;
        const query = { maidEmail };
        const bookings = await bookingCollection.find(query).toArray();
        if (!bookings || bookings.length === 0) {
          return res
            .status(404)
            .json({ message: "No bookings found for the maid" });
        }
        res.json(bookings);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // individual booking information by email requested by maid to customer
    app.get("/customerBooked/:email", async (req, res) => {
      try {
        const customerEmail = req.params.email;
        const query = { customerEmail };
        const bookings = await customerBookedCollection.find(query).toArray();
        if (!bookings || bookings.length === 0) {
          return res
            .status(404)
            .json({ message: "No bookings found for the customer" });
        }
        res.json(bookings);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // individual maid information by email
    app.get("/maid/:email", async (req, res) => {
      try {
        const maidEmail = req.params.email;
        const query = { email: maidEmail };
        const maid = await maidCollection.findOne(query);
        if (!maid) {
          return res.status(404).json({ message: "Maid not found" });
        }
        res.json(maid);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // perDayMaidBookings
    app.get("/perDayMaidBookings", async (req, res) => {
      const query = {
        maidId: req.query.maidId,
        customerName: req.query.customerName,
      };
      const cursor = perDayMaidBookingCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });
    // bookings
    app.get("/bookings", async (req, res) => {
      const query = {};
      const cursor = bookingCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    // bookings from maid to customer
    app.get("/customerBooked", async (req, res) => {
      const query = {};
      const cursor = customerBookedCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    // maidSearchPost
    app.get("/maidSearchPost", async (req, res) => {
      const query = {};
      const cursor = maidSearchPostCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    //admin get
    app.get("/admin", async (req, res) => {
      const query = {};
      const cursor = adminCollection.find(query);
      const admins = await cursor.toArray();
      res.send(admins);
    });

    //user get
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

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

    //driver get
    app.get("/driver", async (req, res) => {
      const query = {};
      const cursor = driverCollection.find(query);
      const drivers = await cursor.toArray();
      res.send(drivers);
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
