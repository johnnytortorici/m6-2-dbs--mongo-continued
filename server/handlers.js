"use strict";
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

const getSeats = async (req, res) => {
  // create client
  const client = await MongoClient(MONGO_URI, options);

  try {
    // connect to client
    await client.connect();

    // connect to db server
    const db = client.db("m6_2_dbs");
    console.log("Connected!");

    const data = await db.collection("seats").find().toArray();
    let seats = {};
    data.forEach((seat) => {
      seats[seat._id] = seat;
    });

    data[0] !== undefined
      ? res.status(200).json({
          seats: seats,
          numOfRows: NUM_OF_ROWS,
          seatsPerRow: SEATS_PER_ROW,
        })
      : res.status(404).json("No seats found.");
  } catch (err) {
    console.log(err.message);
  }

  // close connectiong
  client.close();
  console.log("Disconnected!");
};

const bookSeat = async (req, res) => {
  const { fullName, email, creditCard, expiration, seatId } = req.body;

  // create client
  const client = await MongoClient(MONGO_URI, options);

  try {
    // connect to client
    await client.connect();

    // connect to db server
    const db = client.db("m6_2_dbs");
    console.log("Connected!");

    const data = await db.collection("seats").findOne({ _id: seatId });
    const isAlreadyBooked = data.isBooked;

    if (isAlreadyBooked) {
      res.status(400).json({ message: "This seat has already been booked!" });
    } else if (!creditCard || !expiration) {
      res.status(400).json({
        status: 400,
        message: "Please provide credit card information!",
      });
    } else {
      const query = { _id: seatId };
      const newValues = { $set: { isBooked: true } };

      const r = await db.collection("seats").updateOne(query, newValues);

      r.modifiedCount === 1
        ? res.status(200).json({ status: 200, success: true })
        : res.status(500).json({
            message:
              "An unknown error has occurred. Please try your request again.",
          });
    }
  } catch (err) {
    console.log(err.message);
  }

  // close connectiong
  client.close();
  console.log("Disconnected!");
};

module.exports = { getSeats, bookSeat };
