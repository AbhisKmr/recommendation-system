const { getCollection, closeConn } = require("./myDB");
const { getEmbeddings } = require("./HuggingFaceEmbedding");

const collection = "movies";

async function updateMoviewDataWithEmbeddings() {
  try {
    const moviesColl = await getCollection(collection);
    const cursor = moviesColl.find({
      Plot: { $exists: true },
    });
    for await (const doc of cursor) {
      const inputText = `${doc.Plot} ${doc.Genre} ${doc.Title} ${doc.Actors}`;
      const embedding = await getEmbeddings(inputText);
      doc["plot_embedding"] = embedding;
      const result = await moviesColl.updateOne(
        { _id: doc._id },
        { $set: doc },
        { upsert: true }
      );
      console.log("result:: ", result);
    }
    console.log("Documents updated");
  } catch (err) {
    console.error(err);
  } finally {
    await closeConn();
  }
}

updateMoviewDataWithEmbeddings();
