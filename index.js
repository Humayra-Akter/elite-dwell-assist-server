const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://humayraakter25:gxh2yK96dm8T6xFV@cluster0.q18ojdg.mongodb.net/elite-dwell-assist?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fetchMaidId(bookingId) {
  try {
    const bookingObjectId = new ObjectId(bookingId);
    const booking = await bookingCollection.findOne({
      _id: bookingObjectId,
    });

    if (booking && booking.maidId) {
      return booking.maidId;
    } else {
      throw new Error("Maid ID not found for the given booking");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching Maid ID");
  }
}

async function run() {
  try {
    //await client.connect();
    const customerCollection = client
      .db("elite-dwell-assist")
      .collection("customer");
    const adminCollection = client.db("elite-dwell-assist").collection("admin");
    const userCollection = client.db("elite-dwell-assist").collection("user");
    const maidCollection = client.db("elite-dwell-assist").collection("maid");
    const driverCollection = client
      .db("elite-dwell-assist")
      .collection("driver");
    const babysitterCollection = client
      .db("elite-dwell-assist")
      .collection("babysitter");
    const acknowledgeBookingCollection = client
      .db("elite-dwell-assist")
      .collection("maidPerDayAcknowledgeBooking");
    const reviewCollection = client
      .db("elite-dwell-assist")
      .collection("review");
    const customerBookedCollection = client
      .db("elite-dwell-assist")
      .collection("customerBooking");
    const customerBookedByDriverCollection = client
      .db("elite-dwell-assist")
      .collection("customerBookingByDriver");
    const customerBookedByBabysitterCollection = client
      .db("elite-dwell-assist")
      .collection("customerBookingByBabysitter");
    const maidSearchPostCollection = client
      .db("elite-dwell-assist")
      .collection("maidSearchPost");
    const driverSearchPostCollection = client
      .db("elite-dwell-assist")
      .collection("driverSearchPost");
    const babysitterSearchPostCollection = client
      .db("elite-dwell-assist")
      .collection("babysitterSearchPost");
    const perDayMaidBookingCollection = client
      .db("elite-dwell-assist")
      .collection("perDayMaidBooking");
    const tvBillCollection = client
      .db("elite-dwell-assist")
      .collection("tvBill");
    const ovenBillCollection = client
      .db("elite-dwell-assist")
      .collection("ovenBill");
    const wmBillCollection = client
      .db("elite-dwell-assist")
      .collection("wmBill");
    const rfBillCollection = client
      .db("elite-dwell-assist")
      .collection("rfBill");
    const bookingCollection = client
      .db("elite-dwell-assist")
      .collection("bookings");
    const driverBookingsCollection = client
      .db("elite-dwell-assist")
      .collection("driverBookings");
    const babysitterBookingsCollection = client
      .db("elite-dwell-assist")
      .collection("babysitterBookings");

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

    // Update an existing maid profile
    app.put("/maid/:id", async (req, res) => {
      try {
        const maidId = req.params.id;
        const updatedMaid = req.body;

        // Remove the _id field from the updatedMaid object
        delete updatedMaid._id;

        const session = client.startSession();
        session.startTransaction();

        try {
          // Update maid information
          const resultMaid = await maidCollection.updateOne(
            { _id: new ObjectId(maidId) },
            { $set: updatedMaid },
            { session }
          );

          if (resultMaid.modifiedCount === 1) {
            await session.commitTransaction();
            session.endSession();
            res.json({ message: "Maid profile updated successfully" });
          } else {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({ message: "Maid not found" });
          }
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Update an existing babysitter profile
    app.put("/babysitter/:id", async (req, res) => {
      try {
        const babysitterId = req.params.id;
        const updatedBabysitter = req.body;

        // Remove the _id field from the updatedBabysitter object
        delete updatedBabysitter._id;

        const session = client.startSession();
        session.startTransaction();

        try {
          // Update babysitter information
          const resultBabysitter = await babysitterCollection.updateOne(
            { _id: new ObjectId(babysitterId) },
            { $set: updatedBabysitter },
            { session }
          );

          if (resultBabysitter.modifiedCount === 1) {
            await session.commitTransaction();
            session.endSession();
            res.json({ message: "Babysitter profile updated successfully" });
          } else {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({ message: "Babysitter not found" });
          }
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Update an existing driver profile
    app.put("/driver/:id", async (req, res) => {
      try {
        const driverId = req.params.id;
        const updatedDriver = req.body;

        // Remove the _id field from the updatedDriver object
        delete updatedDriver._id;

        const session = client.startSession();
        session.startTransaction();

        try {
          // Update driver information
          const resultDriver = await driverCollection.updateOne(
            { _id: new ObjectId(driverId) },
            { $set: updatedDriver },
            { session }
          );

          if (resultDriver.modifiedCount === 1) {
            await session.commitTransaction();
            session.endSession();
            res.json({ message: "driver profile updated successfully" });
          } else {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({ message: "driver not found" });
          }
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Update an existing customer profile and user information
    app.put("/customer/:id", async (req, res) => {
      try {
        const customerId = req.params.id;
        const updatedCustomer = req.body;

        // Remove the _id field from the updatedCustomer object
        delete updatedCustomer._id;

        const session = client.startSession();
        session.startTransaction();

        try {
          // Update customer information
          const resultCustomer = await customerCollection.updateOne(
            { _id: new ObjectId(customerId) },
            { $set: updatedCustomer },
            { session }
          );

          // Update corresponding user information
          const userQuery = { email: updatedCustomer.email };
          const resultUser = await userCollection.updateOne(
            userQuery,
            { $set: updatedCustomer },
            { session }
          );

          if (
            resultCustomer.modifiedCount === 1 &&
            resultUser.modifiedCount === 1
          ) {
            await session.commitTransaction();
            session.endSession();
            res.json({
              message:
                "Customer profile and user information updated successfully",
            });
          } else {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({ message: "Customer or user not found" });
          }
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
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

    // babysitter post
    app.post("/babysitter", async (req, res) => {
      const babysitter = req.body;
      const result = await babysitterCollection.insertOne(babysitter);
      if (result.insertedCount === 1) {
        res.status(201).json({ message: "Babysitter added successfully" });
      } else {
        res.status(500).json({ message: "Failed to add babysitter" });
      }
    });

    //babysitter get
    app.get("/babysitter", async (req, res) => {
      const query = {};
      const cursor = babysitterCollection.find(query);
      const babysitters = await cursor.toArray();
      res.send(babysitters);
    });

    // maid per day and tvBill acknowledgeBooking post
    app.post("/acknowledgeBooking", async (req, res) => {
      try {
        const { _id, acknowledgeBookingType } = req.body.booking;
        const result = await acknowledgeBookingCollection.insertOne({
          ...req.body.booking,
          acknowledgeBookingType,
        });

        if (result.insertedCount === 1) {
          let deleteResult;

          if (acknowledgeBookingType === "tvBill") {
            // Handle TV bill acknowledgment logic
            // Assuming there's a collection named tvBillCollection
            deleteResult = await tvBillCollection.deleteOne({
              _id: ObjectId(_id),
            });
          } else {
            // Handle per day maid booking acknowledgment logic
            deleteResult = await perDayMaidBookingCollection.deleteOne({
              _id: ObjectId(_id),
            });
          }

          if (deleteResult.deletedCount === 1) {
            res
              .status(201)
              .json({ message: "AcknowledgeBooking added successfully" });
          } else {
            res.status(500).json({ message: "Failed to delete booking" });
          }
        } else {
          res.status(500).json({ message: "Failed to add acknowledgeBooking" });
        }
      } catch (error) {
        console.error("AcknowledgeBooking error:", error);
        res.status(500).json({ message: "Failed to add acknowledgeBooking" });
      }
    });

    //acknowledgeBooking get
    app.get("/acknowledgeBooking", async (req, res) => {
      const query = {};
      const cursor = acknowledgeBookingCollection.find(query);
      const acknowledgeBooking = await cursor.toArray();
      res.send(acknowledgeBooking);
    });

    // Delete AcknowledgeBooking from UI (without removing from backend)
    app.delete("/acknowledgeBooking/:id", async (req, res) => {
      try {
        const bookingId = req.params.id;
        res.json({
          message: "AcknowledgeBooking deleted from UI successfully",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
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

    // driverSearchPost
    app.post("/driverSearchPost", async (req, res) => {
      try {
        const postData = req.body;
        const result = await driverSearchPostCollection.insertOne(postData);

        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Booking saved successfully" });
        } else {
          res.status(500).json({ message: "Failed to save booking" });
        }
      } catch (error) {
        console.error("Booking error:", error);
      }
    });

    // babysitterSearchPost
    app.post("/babysitterSearchPost", async (req, res) => {
      try {
        const postData = req.body;
        const result = await babysitterSearchPostCollection.insertOne(postData);

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
    });

    // wmBill
    app.post("/wmBill", async (req, res) => {
      try {
        const bookingData = req.body;
        const result = await wmBillCollection.insertOne(bookingData);

        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Booking saved successfully" });
        } else {
          res.status(500).json({ message: "Failed to save booking" });
        }
      } catch (error) {
        console.error("Booking error:", error);
      }
    });

    //wmBill get
    app.get("/wmBill", async (req, res) => {
      const query = {};
      const cursor = wmBillCollection.find(query);
      const wmBill = await cursor.toArray();
      res.send(wmBill);
    });

    // rfBill
    app.post("/rfBill", async (req, res) => {
      try {
        const bookingData = req.body;
        const result = await rfBillCollection.insertOne(bookingData);

        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Booking saved successfully" });
        } else {
          res.status(500).json({ message: "Failed to save booking" });
        }
      } catch (error) {
        console.error("Booking error:", error);
      }
    });

    //rfBill get
    app.get("/rfBill", async (req, res) => {
      const query = {};
      const cursor = rfBillCollection.find(query);
      const rfBill = await cursor.toArray();
      res.send(rfBill);
    });

    // ovenBill
    app.post("/ovenBill", async (req, res) => {
      try {
        const bookingData = req.body;
        const result = await ovenBillCollection.insertOne(bookingData);

        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Booking saved successfully" });
        } else {
          res.status(500).json({ message: "Failed to save booking" });
        }
      } catch (error) {
        console.error("Booking error:", error);
      }
    });

    //ovenBill get
    app.get("/ovenBill", async (req, res) => {
      const query = {};
      const cursor = ovenBillCollection.find(query);
      const ovenBill = await cursor.toArray();
      res.send(ovenBill);
    });

    // reviews post
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      if (result.insertedCount === 1) {
        res.status(201).json({ message: "review added successfully" });
      } else {
        res.status(500).json({ message: "Failed to add review" });
      }
    });

    //review get
    app.get("/review", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.get("/reviews", async (req, res) => {
      try {
        const { userEmail, reviewType } = req.query;
        const query = { userEmail, reviewType };
        const reviews = await reviewCollection.find(query).toArray();

        if (!reviews || reviews.length === 0) {
          return res
            .status(404)
            .json({ message: "No reviews found for the user" });
        }

        res.json(reviews);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    //review per email get
    app.get("/reviews/:email", async (req, res) => {
      try {
        const email = req.params.email; // Updated parameter name
        const query = { email };
        const reviews = await reviewCollection.find(query).toArray();

        if (!reviews || reviews.length === 0) {
          return res.status(404).json({ message: "No reviews found" });
        }

        res.json(reviews);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Endpoint to post average rating for the logged maid
    app.post("/averageRating", async (req, res) => {
      try {
        const { maidEmail, averageRating } = req.body;

        // Update the maid document with the new average rating
        const result = await maidCollection.updateOne(
          { email: maidEmail },
          { $set: { averageRating } }
        );

        if (result.modifiedCount === 1) {
          res
            .status(200)
            .json({ message: "Average rating updated successfully" });
        } else {
          res.status(500).json({ message: "Failed to update average rating" });
        }
      } catch (error) {
        console.error("Error updating average rating:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Endpoint to post average rating for the logged driver
    app.post("/averageRatingDriver", async (req, res) => {
      try {
        const { driverEmail, averageRating } = req.body;

        // Update the driver document with the new average rating
        const result = await driverCollection.updateOne(
          { email: driverEmail },
          { $set: { averageRating } }
        );

        if (result.modifiedCount === 1) {
          res
            .status(200)
            .json({ message: "Average rating updated successfully" });
        } else {
          res.status(500).json({ message: "Failed to update average rating" });
        }
      } catch (error) {
        console.error("Error updating average rating:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Endpoint to post average rating for the logged babysitter
    app.post("/averageRatingBabysitter", async (req, res) => {
      try {
        const { babysitterEmail, averageRating } = req.body;

        // Update the babysitter document with the new average rating
        const result = await babysitterCollection.updateOne(
          { email: babysitterEmail },
          { $set: { averageRating } }
        );

        if (result.modifiedCount === 1) {
          res
            .status(200)
            .json({ message: "Average rating updated successfully" });
        } else {
          res.status(500).json({ message: "Failed to update average rating" });
        }
      } catch (error) {
        console.error("Error updating average rating:", error);
        res.status(500).json({ message: "Internal server error" });
      }
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

    // driverBookings
    app.post("/driverBookings", async (req, res) => {
      try {
        const booking = req.body;
        booking.createdDate = new Date();
        const result = await driverBookingsCollection.insertOne(booking);
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

    // babysitterBookings
    app.post("/babysitterBookings", async (req, res) => {
      try {
        const booking = req.body;
        booking.createdDate = new Date();
        const result = await babysitterBookingsCollection.insertOne(booking);
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

    // Delete a driverBookings by ID
    app.delete("/driverBookings/:id", async (req, res) => {
      try {
        const bookingId = req.params.id;
        const objectId = new ObjectId(bookingId);
        const result = await driverBookingsCollection.deleteOne({
          _id: objectId,
        });
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

    // Delete a babysitterBookings by ID
    app.delete("/babysitterBookings/:id", async (req, res) => {
      try {
        const bookingId = req.params.id;
        const objectId = new ObjectId(bookingId);
        const result = await babysitterBookingsCollection.deleteOne({
          _id: objectId,
        });
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

    // bookings from driver to customer
    app.post("/customerBookingByDriver", async (req, res) => {
      try {
        const booking = req.body;
        const result = await customerBookedByDriverCollection.insertOne(
          booking
        );
        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Booking created successfully" });
        } else {
          res.status(500).json({ message: "Failed to create booking" });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // bookings from babysitter to customer
    app.post("/customerBookingByBabysitter", async (req, res) => {
      try {
        const booking = req.body;
        const result = await customerBookedByBabysitterCollection.insertOne(
          booking
        );
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

    // individual driverBookings information by email
    app.get("/driverBookings/:email", async (req, res) => {
      try {
        const maidEmail = req.params.email;
        const query = { maidEmail };
        const bookings = await driverBookingsCollection.find(query).toArray();
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

    // individual babysitterBookings information by email
    app.get("/babysitterBookings/:email", async (req, res) => {
      try {
        const babysitterEmail = req.params.email;
        const query = { babysitterEmail };
        const bookings = await babysitterBookingsCollection
          .find(query)
          .toArray();
        if (!bookings || bookings.length === 0) {
          return res
            .status(404)
            .json({ message: "No bookings found for the babysitter" });
        }
        res.json(bookings);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // get individual booking information by maid email
    app.get("/bookings/maid/:email", async (req, res) => {
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

    // maid individual get
    app.get("/getMaidId/:bookingId", async (req, res) => {
      try {
        const bookingId = req.params.bookingId;
        const maidId = await fetchMaidId(bookingId);
        res.json({ maidId });
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

    // individual booking information by email requested by driver to customer
    app.get("/customerBookingByDriver/:email", async (req, res) => {
      try {
        const customerEmail = req.params.email;
        const query = { customerEmail };
        const bookings = await customerBookedByDriverCollection
          .find(query)
          .toArray();
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

    // individual booking information by email requested by babysitter to customer
    app.get("/customerBookingByBabysitter/:email", async (req, res) => {
      try {
        const customerEmail = req.params.email;
        const query = { customerEmail };
        const bookings = await customerBookedByBabysitterCollection
          .find(query)
          .toArray();
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
    // individual maid information by email
    app.get("/driver/:email", async (req, res) => {
      try {
        const driverEmail = req.params.email;
        const query = { email: driverEmail };
        const driver = await driverCollection.findOne(query);
        if (!driver) {
          return res.status(404).json({ message: "Driver not found" });
        }
        res.json(driver);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
    // individual maid information by email
    app.get("/babysitter/:email", async (req, res) => {
      try {
        const babysitterEmail = req.params.email;
        const query = { email: babysitterEmail };
        const babysitter = await babysitterCollection.findOne(query);
        if (!babysitter) {
          return res.status(404).json({ message: "Babysitter not found" });
        }
        res.json(babysitter);
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

    // driverBookings
    app.get("/driverBookings", async (req, res) => {
      const query = {};
      const cursor = driverBookingsCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    // babysitterBookings
    app.get("/babysitterBookings", async (req, res) => {
      const query = {};
      const cursor = babysitterBookingsCollection.find(query);
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

    // bookings from maid to customer
    app.get("/customerBookingByDriver", async (req, res) => {
      const query = {};
      const cursor = customerBookedByDriverCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });
    // bookings from maid to customer
    app.get("/customerBookingByBabysitter", async (req, res) => {
      const query = {};
      const cursor = customerBookedByBabysitterCollection.find(query);
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

    // driverSearchPost
    app.get("/driverSearchPost", async (req, res) => {
      const query = {};
      const cursor = driverSearchPostCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    // babysitterSearchPost
    app.get("/babysitterSearchPost", async (req, res) => {
      const query = {};
      const cursor = babysitterSearchPostCollection.find(query);
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
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
