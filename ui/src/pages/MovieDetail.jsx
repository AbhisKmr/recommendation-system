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
    <div>
      <h1>{movie.Title}</h1>
      <img src={movie.Poster} alt={movie.title} />
      <p>{movie.Plot}</p>
      <h2>Recommended Movies</h2>
      <div>
        {recommendations.map(
          (movie) =>
            movie.Poster && <MoviePoster key={movie._id} movie={movie} />
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
