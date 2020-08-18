const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const migrateSeats = async (dbName) => {
  // create client
  const client = await MongoClient(MONGO_URI, options);

  try {
    // connect to client
    await client.connect();

    // connect to db server
    const db = client.db(dbName);
    console.log("Connected!");

    // loop and assign seats
    const seatsObj = {};
    const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (let r = 0; r < row.length; r++) {
      for (let s = 1; s < 13; s++) {
        let _id = `${row[r]}-${s}`;
        seatsObj[_id] = {
          _id: _id,
          price: 225,
          isBooked: false,
        };
      }
    }

    // collect seat objects into an array
    const seats = Object.values(seatsObj);

    // insert the array into the db
    const r = await db.collection("seats").insertMany(seats);
    seats.length === r.insertedCount
      ? console.log("Success!")
      : console.log("Something went wrong!");
  } catch (err) {
    console.log(err.message);
  }

  // close connection
  client.close();
  console.log("Disconnected!");
};

migrateSeats("m6-2-dbs");
