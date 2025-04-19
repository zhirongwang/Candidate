import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "mongodb://localhost:27017";

const client = new MongoClient(connectionString);

let conn;
try {
    console.log('try to connecnt')
    conn = await client.connect();
    console.log('try to connecnt 1', conn)
} catch(e) {
    console.error(e);
}

let db = conn.db("local");

export default db;

// MongoClient.connect(mongoURI)
//   .then(client => {
//     const db = client.db(); // Default database
//     console.log('MongoDB connected successfully!');

//     const users = db.collection('candidate');
//     users.find().toArray()
//       .then(result => {
//         console.log('MongoDB connected result!1, ',  result);
//       })

//   })
//   .catch(err => {
//     console.error('MongoDB connection error:', err);
//     process.exit(1); // Exit the process if MongoDB connection fails
//   });