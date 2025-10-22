import { useState } from "react";

const API_KEY = "4dfb1ff22b81c9dd5b003143fc0e8246";

export default function useMovies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchMovies = async (query, pageNumber = 1, append = false) => {
    if (query.trim().length < 3) return;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=${pageNumber}&include_adult=false`
      );
      const data = await res.json();

      setHasMore(pageNumber < data.total_pages);
      setPage(pageNumber);
      if (append) setMovies((prev) => [...prev, ...(data.results || [])]);
      else setMovies(data.results || []);
    } catch (err) {
      console.error("Viga filmide laadimisel:", err);
    }
  };

  return { movies, page, hasMore, fetchMovies, setMovies };
}
