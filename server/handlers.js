"use strict";
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

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
      ? res.status(200).json({ seats: seats, numOfRows: 8, seatsPerRow: 12 })
      : res.status(404).json("No seats found.");
  } catch (err) {
    console.log(err.message);
  }

  // close connectiong
  client.close();
  console.log("Disconnected!");
};

module.exports = { getSeats };
