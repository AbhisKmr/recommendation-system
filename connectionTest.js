const { getCollection } = require("./myDB");

async function showMovies() {
  const movies = await getCollection("movies");
  const results = await movies.find({}).toArray();
  console.log(results);
}

showMovies();
