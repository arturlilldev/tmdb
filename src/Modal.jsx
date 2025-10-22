import { useEffect, useState } from "react";

export default function Modal({ movies, selectedIndex, onClose, onChangeIndex }) {
  const movie = movies[selectedIndex];
  const [translation, setTranslation] = useState("");

  useEffect(() => {
    if (movie?.overview) translateText(movie.overview);
  }, [movie]);

  const translateText = async (text) => {
    if (!text) {
      setTranslation("");
      return;
    }
    const limitedText = text.length > 500 ? text.slice(0, 500) + "..." : text;
    setTranslation("Tõlkimine käib...");
    try {
      const url = `https://corsproxy.io/?https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        limitedText
      )}&langpair=en|et`;
      const response = await fetch(url);
      const data = await response.json();
      setTranslation(data.responseData.translatedText || "Tõlge puudub");
    } catch {
      setTranslation("Tõlge ebaõnnestus");
    }
  };

  const prevMovie = () => {
    if (selectedIndex > 0) onChangeIndex(selectedIndex - 1);
  };

  const nextMovie = () => {
    if (selectedIndex < movies.length - 1) onChangeIndex(selectedIndex + 1);
  };

  if (!movie) return null;

  return (
    <div
      onClick={onClose}
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
        <div style={{ flex: "0 0 240px", textAlign: "center" }}>
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
              alt={movie.title}
              style={{
                width: "100%",
                borderRadius: "8px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
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

          <div style={{ marginTop: "10px" }}>
            <button onClick={prevMovie} disabled={selectedIndex === 0}>
              ⬅ Eelmine
            </button>
            <button onClick={onClose} style={{ margin: "0 5px" }}>
              Sulge
            </button>
            <button
              onClick={nextMovie}
              disabled={selectedIndex === movies.length - 1}
            >
              Järgmine ➡
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h2>{movie.title}</h2>
          <p>{movie.overview || "(Kirjeldus puudub)"}</p>
          <hr />
          <p style={{ fontStyle: "italic", color: "#333" }}>{translation}</p>
        </div>
      </div>
    </div>
  );
}
