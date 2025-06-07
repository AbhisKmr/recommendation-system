import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";

function MoviePoster({ movie }) {
  return (
    <Link key={movie._id}>
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
