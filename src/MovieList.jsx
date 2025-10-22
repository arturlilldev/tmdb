import { useEffect, useState } from "react";
import useMovies from "./useMovies";
import Modal from "./Modal";

export default function MovieList({ query, isSaytEnabled }) {
  const { movies, page, hasMore, fetchMovies } = useMovies();
  const [selectedIndex, setSelectedIndex] = useState(null);

  // SAYT (Search As You Type)
  useEffect(() => {
    if (isSaytEnabled && query.length >= 3) {
      const timeout = setTimeout(() => fetchMovies(query, 1), 500);
      return () => clearTimeout(timeout);
    }
  }, [query, isSaytEnabled]);

  const loadMore = () => fetchMovies(query, page + 1, true);
  const openModal = (index) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  return (
    <>
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
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
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
          <div style={{ flex: 1 }}>
            <h3>{movie.title}</h3>
            <p>
              {movie.overview || "(Kirjeldus puudub)"}
              <br />
              <em style={{ color: "#555" }}>
                (Tõlge avaneb, kui klõpsad postril)
              </em>
            </p>
          </div>
        </div>
      ))}

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
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Lae juurde ⬇
          </button>
        </div>
      )}

      {selectedIndex !== null && (
        <Modal
          movies={movies}
          selectedIndex={selectedIndex}
          onClose={closeModal}
          onChangeIndex={setSelectedIndex}
        />
      )}
    </>
  );
}
