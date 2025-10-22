// Modal.jsx
import React, { useEffect } from "react";

/**
 * Props:
 * - movie: objekt (või null) — valitud film
 * - onClose: funktsioon — sulgeb modali
 * - onPrev: funktsioon — näitab eelmise filmi
 * - onNext: funktsioon — näitab järgmise filmi
 * - hasPrev: boolean — kas eelmine on olemas
 * - hasNext: boolean — kas järgmine on olemas
 */
export default function Modal({ movie, onClose, onPrev, onNext, hasPrev, hasNext }) {
  // Turvakontroll — kui movie puudub, ei renderda modali
  if (!movie) return null;

  const IMAGE_BASE = "https://image.tmdb.org/t/p/w400";

  // Klahvikäsitlejad: ESC sulgeb, LEFT/RIGHT navigeerivad
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      } else if (e.key === "ArrowLeft") {
        if (hasPrev) onPrev?.();
      } else if (e.key === "ArrowRight") {
        if (hasNext) onNext?.();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={movie.title || "Film detail"}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "row",
          gap: 20,
          padding: 20,
        }}
      >
        {/* Vasak veerg: poster + nupud (nupud pildi all, sama laiusega) */}
        <div
          style={{
            flex: "0 0 320px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {movie.poster_path ? (
            <img
              src={`${IMAGE_BASE}${movie.poster_path}`}
              alt={movie.title}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 10,
                objectFit: "cover",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
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
                height: 480,
                borderRadius: 10,
                background: "#e6e6e6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
                fontSize: 14,
              }}
            >
              Pilti pole
            </div>
          )}

          {/* Nupud: võtavad sama laiuse kui poster */}
          <div style={{ width: "100%", marginTop: 14, display: "flex", gap: 8 }}>
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              aria-disabled={!hasPrev}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: hasPrev ? "#fafafa" : "#f0f0f0",
                cursor: hasPrev ? "pointer" : "not-allowed",
                transition: "filter 0.15s ease",
              }}
              onMouseEnter={(e) => hasPrev && (e.currentTarget.style.filter = "brightness(0.95)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              ⬅ Eelmine
            </button>

            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                background: "#ff4d4d",
                color: "#fff",
                cursor: "pointer",
                transition: "filter 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.92)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              Sulge
            </button>

            <button
              onClick={onNext}
              disabled={!hasNext}
              aria-disabled={!hasNext}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: hasNext ? "#fafafa" : "#f0f0f0",
                cursor: hasNext ? "pointer" : "not-allowed",
                transition: "filter 0.15s ease",
              }}
              onMouseEnter={(e) => hasNext && (e.currentTarget.style.filter = "brightness(0.95)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              Järgmine ➡
            </button>
          </div>
        </div>

        {/* Parem veerg: pealkiri, kirjeldus ja muu info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>{movie.title}</h2>

          {/* Lisainfo reaalsel andmete olemasolul */}
          <div style={{ color: "#666", fontSize: 14, marginBottom: 12 }}>
            {movie.release_date ? <div>Väljaanne: {movie.release_date}</div> : null}
            {movie.vote_average !== undefined ? (
              <div>Hinne: {movie.vote_average} / 10</div>
            ) : null}
          </div>

          <div style={{ marginBottom: 12 }}>
            <p style={{ marginTop: 0, color: "#333", lineHeight: 1.5 }}>
              {movie.overview || "(Kirjeldus puudub)"}
            </p>
          </div>

          {/* Soovi korral siia saab lisada tõlke indikaatori / tõlke teksti */}
        </div>
      </div>
    </div>
  );
}
