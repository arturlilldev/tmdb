import { useEffect, useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isSaytEnabled, setIsSaytEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [translation, setTranslation] = useState("");

  const API_KEY = "4dfb1ff22b81c9dd5b003143fc0e8246";

  const searchMovies = async (searchText, pageNumber = 1, append = false) => {
    if (searchText.trim().length < 3) return;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          searchText
        )}&page=${pageNumber}&include_adult=false`
      );
      const data = await res.json();
      setHasMore(pageNumber < data.total_pages);
      setPage(pageNumber);
      if (append) setMovies((prev) => [...prev, ...(data.results || [])]);
      else setMovies(data.results || []);
    } catch (err) {
      console.error("Viga andmete laadimisel:", err);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    searchMovies(query, nextPage, true);
  };

  useEffect(() => {
    if (isSaytEnabled && query.length >= 3) {
      const timeout = setTimeout(() => {
        searchMovies(query, 1);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [query, isSaytEnabled]);

  // ---- Tõlkimine MyMemory + CORS proxy ----
  const translateText = async (text) => {
    if (!text) {
      setTranslation("");
      return;
    }

    const limitedText = text.length > 500 ? text.slice(0, 500-3) + "..." : text;
    setTranslation("Tõlkimine käib...");

    try {
      const url = `https://corsproxy.io/?https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        limitedText
      )}&langpair=en|et`;

      const response = await fetch(url);
      const data = await response.json();
      setTranslation(data.responseData.translatedText || "Tõlge puudub");
    } catch (error) {
      console.error("Tõlkimine ebaõnnestus:", error);
      setTranslation("Tõlge ebaõnnestus");
    }
  };

  const openModal = (index) => {
    setSelectedIndex(index);
    const movie = movies[index];
    if (movie.overview) translateText(movie.overview);
  };

  const closeModal = () => {
    setSelectedIndex(null);
    setTranslation("");
  };

  const prevMovie = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(newIndex);
      const movie = movies[newIndex];
      if (movie.overview) translateText(movie.overview);
    }
  };

  const nextMovie = () => {
    if (selectedIndex < movies.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedIndex(newIndex);
      const movie = movies[newIndex];
      if (movie.overview) translateText(movie.overview);
    }
  };

  const selectedMovie = selectedIndex !== null ? movies[selectedIndex] : null;

  const buttonHoverStyle = (e, enter) => {
    e.currentTarget.style.filter = enter ? "brightness(0.9)" : "brightness(1)";
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2>
        Sisesta otsitava pealkirja algus (vähemalt 3 tähemärki):
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px", width: "250px" }}
        />
        <button
          onClick={() => searchMovies(query)}
          disabled={isSaytEnabled}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            cursor: isSaytEnabled ? "not-allowed" : "pointer",
            opacity: isSaytEnabled ? 0.5 : 1,
            transition: "filter 0.2s ease",
          }}
          onMouseEnter={(e) => !isSaytEnabled && buttonHoverStyle(e, true)}
          onMouseLeave={(e) => buttonHoverStyle(e, false)}
        >
          Otsi
        </button>
        <button
          onClick={() => setIsSaytEnabled(!isSaytEnabled)}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: isSaytEnabled ? "#f88" : "#8f8",
            transition: "filter 0.2s ease",
          }}
          onMouseEnter={(e) => buttonHoverStyle(e, true)}
          onMouseLeave={(e) => buttonHoverStyle(e, false)}
        >
          {isSaytEnabled ? "Keela SAYT" : "Luba SAYT"}
        </button>
      </h2>

      {movies.length === 0 && query.length >= 3 && <p>Ei leitud tulemusi...</p>}

      {movies.map((movie, index) => (
        <div
          key={movie.id}
          style={{
            display: "flex",
            alignItems: "flex-start",
            borderBottom: "1px solid #ddd",
            padding: "10px 0",
          }}
        >
          <div style={{ width: "150px", marginRight: "15px" }}>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: "100%",
                  cursor: "pointer",
                  borderRadius: "8px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => openModal(index)}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "225px",
                  background: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                }}
              >
                Pole pilti
              </div>
            )}
          </div>
          <div style={{ flex: "1" }}>
            <h3>{movie.title}</h3>
            <p>
              {movie.overview || "(Kirjeldus puudub)"}
              <br />
              <em style={{ color: "#555" }}>
                (Tõlge eesti keelde avaneb, kui klõpsad postril)
              </em>
            </p>
          </div>
        </div>
      ))}

      {/* 🔽 "Lae juurde" nupp */}
      {hasMore && movies.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button
            onClick={loadMore}
            style={{
              padding: "8px 16px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
              transition: "transform 0.2s ease, filter 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.9)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
          >
            Lae juurde ⬇
          </button>
        </div>
      )}

      {/* 🔳 Modal */}
      {selectedMovie && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "10px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "12px",
              width: "min(90%, 900px)",
              maxHeight: "90%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              padding: "20px",
            }}
          >
            <div
              style={{
                flex: "0 0 240px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {selectedMovie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w400${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "360px",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                  }}
                >
                  Pole pilti
                </div>
              )}

              <div style={{ width: "100%" }}>
                <button
                  onClick={prevMovie}
                  disabled={selectedIndex === 0}
                  style={{
                    width: "32%",
                    marginRight: "2%",
                    padding: "6px",
                    cursor: selectedIndex === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  ⬅ Eelmine
                </button>
                <button
                  onClick={closeModal}
                  style={{ width: "32%", marginRight: "2%", padding: "6px" }}
                >
                  Sulge
                </button>
                <button
                  onClick={nextMovie}
                  disabled={selectedIndex === movies.length - 1}
                  style={{
                    width: "32%",
                    padding: "6px",
                    cursor:
                      selectedIndex === movies.length - 1
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Järgmine ➡
                </button>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h2>{selectedMovie.title}</h2>
              <p>{selectedMovie.overview || "(Kirjeldus puudub)"}</p>
              <hr />
              <p style={{ fontStyle: "italic", color: "#333" }}>{translation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
