import { useEffect, useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isSaytEnabled, setIsSaytEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [translation, setTranslation] = useState("");

  const API_KEY = "4dfb1ff22b81c9dd5b003143fc0e8246";

  const searchMovies = async (searchText) => {
    if (searchText.trim().length < 3) return;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          searchText
        )}&page=1&include_adult=false`
      );
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error("Viga andmete laadimisel:", err);
    }
  };

  useEffect(() => {
    if (isSaytEnabled && query.length >= 3) {
      const timeout = setTimeout(() => {
        searchMovies(query);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [query, isSaytEnabled]);

  // -----------------------
  // Neurotõlge integratsioon
  // -----------------------
  const translateText = async (text) => {
    if (!text) {
      setTranslation("");
      return;
    }

    const limitedText = text.length > 500 ? text.slice(0, 500) + "..." : text;

    try {
      const response = await fetch("https://neurotolge.ee/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: limitedText,
          source_lang: "en",
          target_lang: "et",
        }),
      });
      const data = await response.json();
      setTranslation(data.translation || "Tõlge puudub");
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
              flexDirection: window.innerWidth < 600 ? "column" : "row",
              gap: "20px",
              padding: "20px",
            }}
          >
            {/* Poster ja nupud ühes veerus */}
            <div
              style={{
                flex: "0 0 240px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                marginBottom: window.innerWidth < 600 ? "10px" : "0",
              }}
            >
              {selectedMovie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`}
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

              {/* Navigeerimis- ja sulgenupud posterist all */}
              {["prevMovie", "nextMovie", "closeModal"].map((btn, i) => {
                let label, onClick, disabled = false;
                if (btn === "prevMovie") {
                  label = "⬅ Eelmine";
                  onClick = prevMovie;
                  disabled = selectedIndex === 0;
                } else if (btn === "nextMovie") {
                  label = "Järgmine ➡";
                  onClick = nextMovie;
                  disabled = selectedIndex === movies.length - 1;
                } else {
                  label = "Sulge";
                  onClick = closeModal;
                }
                return (
                  <button
                    key={i}
                    onClick={onClick}
                    disabled={disabled}
                    style={{
                      width: "100%",
                      padding: "5px 10px",
                      cursor: disabled ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.5 : 1,
                      transition: "filter 0.2s ease",
                    }}
                    onMouseEnter={(e) => !disabled && buttonHoverStyle(e, true)}
                    onMouseLeave={(e) => buttonHoverStyle(e, false)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Tekst paremal */}
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
