import { useEffect, useState } from "react";
import axios from "axios";
import MoviePoster from "../components/MoviePoster";
import "../style/Home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data?.data))
      .catch((err) => console.error(err));
  }, []);

  const onInputChange = (e) => {
    console.log(e.key, e.target.value);
    setSearch(e.target.value);
  };
  console.log("movies", movies);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      setMovies([]);
      console.log("Enter key pressed!");
      const res = await axios.get(
        `http://localhost:3000/movies/search?query=${search}`
      );
      const data = res.data?.data;
      console.log(data);
      setMovies(data);
    }
  };
  return (
    <div className="container">
      <h1 className="title">Movies Recommendations</h1>
      <input
        type="text"
        className="search-input"
        placeholder="Search Movies..."
        value={search}
        onChange={(e) => onInputChange(e)}
        onKeyDown={handleKeyDown}
      />

      <div className="movies-container">
        {movies.length === 0 && <p>Loading...</p>}
        {movies.map((movie) => movie.Poster && <MoviePoster movie={movie} />)}
      </div>
    </div>
  );
};

export default Home;
