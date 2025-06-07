const express = require("express");
const cors = require("cors");
const { getCollection, closeConn, connectToMongo } = require("../myDB");
const app = express();

const port = 3000;

app.use(cors());
app.use(express.json());

// test api

// app.get("/ping", (req, res) => {
//   res.json({
//     message: "pong",
//     timestamp: new Date().toISOString(),
//   });
// });

app.get("/movies", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    if (page < 1) {
      return res.status(400).json({
        message: "Page number must be greater than 0",
      });
    }
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        message: "Limit must be between 1 and 100",
      });
    }
    const collection = await getCollection("movies");
    const movies = await collection
      .find({}, { projection: { plot_embedding: 0 } })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Start server
const server = app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await connectToMongo();
});

process.on("SIGINT", async () => {
  try {
    await closeConn();
    server.close(() => {
      process.exit(0);
    });
  } catch (error) {
    process.exit(1);
  }
});
