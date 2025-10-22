import React, { useEffect, useState } from "react";

const API_KEY = "4dfb1ff22b81c9dd5b003143fc0e8246";
const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w200";

export default function MovieList({ setMovies, onOpenModal }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [isSaytEnabled, setIsSaytEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (search, pageNum = 1, append = false) => {
    if (!search || search.trim().length < 3) {
      setResults([]);
      setMovies([]);
      setPage(1);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          search
        )}&page=${pageNum}&include_adult=false`
      );
      const data = await res.json();
      const newResults = Array.isArray(data.results) ? data.results : [];
      const all = append ? [...results, ...newResults] : newResults;
      setResults(all);
      setMovies(all);
      setPage(pageNum);
    } catch (err) {
      console.error("TMDB fetch error:", err);
      setMovies(results || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSaytEnabled && query.length >= 3) {
      const to = setTimeout(() => fetchMovies(query, 1), 500);
      return () => clearTimeout(to);
    }
  }, [query, isSaytEnabled]);

  const loadMore = () => fetchMovies(query, page + 1, true);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <input
          value={query}
          placeholder="Sisesta pealkirja algus (min 3 tähemärki)"
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, width: 300 }}
        />
        <button
          onClick={() => fetchMovies(query, 1)}
          disabled={isSaytEnabled || query.length < 3}
          style={{ marginLeft: 8, padding: "8px 12px" }}
        >
          Otsi
        </button>
        <button
          onClick={() => setIsSaytEnabled((v) => !v)}
          style={{ marginLeft: 8, padding: "8px 12px" }}
        >
          {isSaytEnabled ? "Keela SAYT" : "Luba SAYT"}
        </button>
      </div>

      {isLoading && <p>Laadin...</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {results.map((movie, idx) => (
          <div
            key={movie.id ?? idx}
            style={{
              display: "flex",
              gap: 12,
              padding: 12,
              border: "1px solid #eee",
              borderRadius: 8,
              cursor: "pointer",
              alignItems: "flex-start",
            }}
            onClick={() => onOpenModal(idx)}
          >
            {movie.poster_path ? (
              <img
                src={`${IMAGE_BASE}${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: 120,
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 6,
                  transition: "transform .2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            ) : (
              <div
                style={{
                  width: 120,
                  height: 180,
                  background: "#ddd",
                  borderRadius: 6,
                }}
              />
            )}

            <div style={{ flex: 1, textAlign: "left" }}>
              <h3 style={{ margin: "0 0 8px 0" }}>{movie.title}</h3>
              <p style={{ margin: 0, color: "#444" }}>
                {movie.overview || "(Kirjeldus puudub)"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={loadMore} style={{ padding: "10px 16px" }}>
            Lae juurde
          </button>
        </div>
      )}
    </div>
  );
}
