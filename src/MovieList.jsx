import React, { useState, useEffect } from "react";

const API_KEY = "4dfb1ff22b81c9dd5b003143fc0e8246";
const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w200";

function MovieList({ onOpenModal, setMovies }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [isSaytEnabled, setIsSaytEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [translationCache, setTranslationCache] = useState({});

  // --- Päring TMDB API-st ---
  const fetchMovies = async (search, pageNum = 1, append = false) => {
    if (!search || search.length < 3) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          search
        )}&page=${pageNum}&include_adult=false`
      );
      const data = await res.json();
      const newResults = data.results || [];
      const allResults = append ? [...results, ...newResults] : newResults;

      setResults(allResults);
      setMovies(allResults);
    } catch (err) {
      console.error("TMDB fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- SAyT (Search-as-you-type) ---
  useEffect(() => {
    if (isSaytEnabled && query.length >= 3) {
      const delay = setTimeout(() => fetchMovies(query), 500);
      return () => clearTimeout(delay);
    }
  }, [query, isSaytEnabled]);

  // --- Tõlge (kasutades AllOrigins + LibreTranslate) ---
  const translateText = async (text) => {
    if (!text) return "Tõlge puudub";
    if (translationCache[text]) return translationCache[text];

    const limitedText = text.length > 500 ? text.slice(0, 500) + "..." : text;

    try {
      const res = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(
          "https://libretranslate.com/translate"
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: limitedText,
            source: "en",
            target: "et",
            format: "text",
          }),
        }
      );
      const data = await res.json();
      const translated = data.translatedText || "Tõlge puudub";
      setTranslationCache((prev) => ({ ...prev, [text]: translated }));
      return translated;
    } catch (err) {
      console.error("Tõlkimine ebaõnnestus:", err);
      return "Tõlge ebaõnnestus";
    }
  };

  // --- „Lae juurde” (järgmine leht) ---
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(query, nextPage, true);
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Sisesta otsitava filmi pealkiri..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "10px", width: "250px" }}
        />
        <button
          onClick={() => fetchMovies(query)}
          disabled={isSaytEnabled || query.length < 3}
          style={{
            padding: "10px",
            marginLeft: "10px",
            cursor: isSaytEnabled ? "not-allowed" : "pointer",
          }}
        >
          Otsi
        </button>
        <button
          onClick={() => setIsSaytEnabled(!isSaytEnabled)}
          style={{
            padding: "10px",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          {isSaytEnabled ? "Keela SAyT" : "Luba SAyT"}
        </button>
      </div>

      {isLoading && <p>Laadin andmeid...</p>}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {results.map((movie, index) => (
          <div
            key={movie.id}
            onClick={() => onOpenModal(movie, index)}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              backgroundColor: "#fafafa",
              border: "1px solid #ccc",
              borderRadius: "10px",
              margin: "10px",
              padding: "10px",
              width: "500px",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {movie.poster_path ? (
              <img
                src={`${IMAGE_BASE}${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: "100px",
                  height: "150px",
                  marginRight: "15px",
                  borderRadius: "5px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100px",
                  height: "150px",
                  marginRight: "15px",
                  backgroundColor: "#ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "5px",
                }}
              >
                No image
              </div>
            )}
            <div style={{ flex: 1, textAlign: "left" }}>
              <h3>{movie.title}</h3>
              <p style={{ fontSize: "14px", color: "#555" }}>{movie.overview}</p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#333",
                  fontStyle: "italic",
                }}
              >
                {movie.overview
                  ? translationCache[movie.overview] || "Tõlgin..."
                  : ""}
              </p>
              {movie.overview && !translationCache[movie.overview] && (
                <span style={{ display: "none" }}>
                  {translateText(movie.overview)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <button
          onClick={loadMore}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "transform 0.2s, background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ddd")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
        >
          Lae juurde
        </button>
      )}
    </div>
  );
}

export default MovieList;
