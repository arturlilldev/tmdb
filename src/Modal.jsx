import React, { useEffect, useState } from "react";

export default function Modal({ movie, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const [translation, setTranslation] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  if (!movie) return null;

  const IMAGE_BASE = "https://image.tmdb.org/t/p/w400";

  // MyMemory API + allorigins.win
  useEffect(() => {
    const translateText = async (text) => {
      if (!text) {
        setTranslation("");
        return;
      }

      // kuni 500 tähemärki
      const truncated = text.length > 500 ? text.slice(0, 500) : text;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        truncated
      )}&langpair=en|et`;

      setIsTranslating(true);
      try {
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        const parsed = JSON.parse(data.contents);
        setTranslation(parsed.responseData?.translatedText || "(Tõlge puudub)");
      } catch (err) {
        console.error("Tõlge ebaõnnestus:", err);
        setTranslation("(Tõlge puudub)");
      } finally {
        setIsTranslating(false);
      }
    };

    translateText(movie.overview || "");
  }, [movie]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
      else if (e.key === "ArrowLeft" && hasPrev) onPrev?.();
      else if (e.key === "ArrowRight" && hasNext) onNext?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: 12,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "min(95%, 1000px)",
          maxWidth: 1000,
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          gap: 20,
          padding: 20,
        }}
      >
        <div style={{ flex: "0 0 320px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {movie.poster_path ? (
            <img
              src={`${IMAGE_BASE}${movie.poster_path}`}
              alt={movie.title}
              style={{ width: "100%", borderRadius: 10, objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "100%", height: 480, background: "#eee", borderRadius: 10 }}>Pilti pole</div>
          )}

          <div style={{ width: "100%", marginTop: 14, display: "flex", gap: 8 }}>
            <button onClick={onPrev} disabled={!hasPrev} style={{ flex: 1, padding: "10px" }}>⬅ Eelmine</button>
            <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f44", color: "#fff", border: "none" }}>Sulge</button>
            <button onClick={onNext} disabled={!hasNext} style={{ flex: 1, padding: "10px" }}>Järgmine ➡</button>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ marginTop: 0 }}>{movie.title}</h2>
          <p>{movie.overview || "(Kirjeldus puudub)"}</p>
          <p style={{ color: "#444", fontStyle: "italic" }}>
            {isTranslating ? "Tõlgin..." : translation}
          </p>
        </div>
      </div>
    </div>
  );
}
