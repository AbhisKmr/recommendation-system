const express = require("express");
const cors = require("cors");
const { getCollection, closeConn, connectToMongo } = require("../myDB");
const { getEmbeddings } = require("../HuggingFaceEmbedding");
const { ObjectId } = require("mongodb");
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

function getAggregationPipeline(embeddings, id) {
  const aggPipeline = [
    {
      $vectorSearch: {
        index: "movies_vector_index",
        path: "plot_embedding",
        queryVector: embeddings,
        numCandidates: 50,
        limit: 10,
      },
    },
    {
      $project: {
        plot_embedding: 0,
        // score: { $meta: "vectorSearchScore" },
      },
    },
  ];
  if (id) {
    aggPipeline.push({
      $match: { _id: { $ne: new ObjectId(id) } },
    });
  }
  console.log(aggPipeline);
  return aggPipeline;
}

app.get("/movies/search", async (req, res) => {
  try {
    const { query } = req.query;
    const plot_embedding = await getEmbeddings(query);
    const collection = await getCollection("movies");
    const aggregationPipeline = await getAggregationPipeline(plot_embedding);
    const movies = await collection.aggregate(aggregationPipeline).toArray();

    res.json({
      data: movies,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error:)",
      error: error.message,
    });
  }
});

app.get("/movies/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const collection = await getCollection("movies");
    const movie = await collection.findOne(
      { _id: new ObjectId(movieId) },
      { projection: { plot_embedding: 0 } }
    );

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.json({
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

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

app.get("/movies/recommend/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const collection = await getCollection("movies");
    const { plot_embedding } = await collection.findOne(
      { _id: new ObjectId(movieId) },
      { projection: { plot_embedding: 1 } }
    );
    const aggregationPipeline = await getAggregationPipeline(
      plot_embedding,
      movieId
    );
    const movies = await collection.aggregate(aggregationPipeline).toArray();

    res.json({
      data: movies,
    });
  } catch (error) {
    console.log(error);
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
