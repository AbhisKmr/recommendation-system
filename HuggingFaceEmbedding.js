const axios = require("axios");

async function getEmbeddings(data) {
  const apiKey = "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";
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    data: {
      inputs: data,
    },
  };

  try {
    const response = await axios.request(config);
    console.log("res::", response.data);
    return response.data;
  } catch (err) {
    console.error("API error:", err.response?.data || err.message);
  }
}

module.exports = {
  getEmbeddings,
};

// getEmbeddings("Test embeding");
