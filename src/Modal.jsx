import React, { useEffect } from "react";

function Modal({ movie, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w400";

  // ESC klahv sulgeb modali
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          width: "min(90%, 800px)",
          maxHeight: "90vh",
          overflowY: "auto",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>{movie.title}</h2>

        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE}${movie.poster_path}`}
            alt={movie.title}
            style={{
              width: "400px",
              height: "600px",
              objectFit: "cover",
              borderRadius: "10px",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "sc
