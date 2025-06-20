import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";

function MoviePoster({ movie }) {
  const navigateToMovieDetail = (movieId) => {
    window.open(`/movies/${movieId}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Link key={movie._id} onClick={() => navigateToMovieDetail(movie._id)}>
      <div>
        <ImageWithFallback src={movie.Poster} alt={movie.Title} />
      </div>

      <div>
        <p>{movie.Title}</p>
        <p>{movie.Genre}</p>
      </div>
    </Link>
  );
}

export default MoviePoster;
