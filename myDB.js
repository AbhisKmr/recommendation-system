const { MongoClient } = require("mongodb");

// const uri = "mongodb://localhost:27017";
// const dbName = "local";
const uri =
  "mongodb+srv://abhi-dev:2husjsf4q7TMyp6v@cluster0.momprx8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "recommendation-system";
let client;
let db;

async function connectToMongo() {
  if (db) return db;

  client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  db = client.db(dbName);
  return db;
}

async function getDB() {
  if (!db) {
    await connectToMongo();
  }
  return db;
}

async function getCollection(collectionName) {
  const database = await getDB();
  return database.collection(collectionName);
}

async function closeConn() {
  if (client) {
    await client.close();
  }
}

module.exports = {
  connectToMongo,
  getDB,
  getCollection,
  closeConn,
};
