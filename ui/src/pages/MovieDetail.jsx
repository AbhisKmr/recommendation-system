import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MoviePoster from "../components/MoviePoster";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/movies/recommend/${id}`)
      .then((res) => setRecommendations(res.data.data))
      .catch(console.error);
  }, [id]);
  useEffect(() => {
    axios
      .get(`http://localhost:3000/movies/${id}`)
      .then((res) => setMovie(res.data.data))
      .catch(console.error);
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div style={{ padding: "12px" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1>{movie.Title.toUpperCase()}</h1>
        <img height={700} src={movie.Poster} alt={movie.title} />
        <p style={{ marginTop: 30, fontSize: "1.5rem" }}>{movie.Plot}</p>
      </div>
      <hr
        style={{
          color: "gray",
          height: 0.5,
        }}
      />
      <h3 style={{ marginTop: "40px" }}>You may like</h3>
      <div marginTop={20} className="movies-container">
        {recommendations.map(
          (movie) =>
            movie.Poster && <MoviePoster key={movie._id} movie={movie} />
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
