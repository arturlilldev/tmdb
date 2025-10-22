// App.jsx
import React, { useState } from "react";
import MovieList from "./MovieList";
import Modal from "./Modal";

export default function App() {
  const [movies, setMovies] = useState([]); // alguses tühi massiiv — ei tohi olla undefined
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = (index) => {
    if (!Array.isArray(movies) || index == null) return;
    if (index < 0 || index >= movies.length) return;
    setSelectedIndex(index);
  };

  const closeModal = () => setSelectedIndex(null);

  const showPrevious = () => {
    if (!Array.isArray(movies) || selectedIndex == null) return;
    if (selectedIndex > 0) setSelectedIndex((i) => i - 1);
  };

  const showNext = () => {
    if (!Array.isArray(movies) || selectedIndex == null) return;
    if (selectedIndex < movies.length - 1) setSelectedIndex((i) => i + 1);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1>Filmiotsing</h1>

      {/* MovieList vastutab otsingu, päringu ja setMovies kutsumise eest */}
      <MovieList setMovies={setMovies} onOpenModal={openModal} />

      {/* Modal avaneb ainult, kui selectedIndex on number */}
      {selectedIndex !== null && Array.isArray(movies) && movies[selectedIndex] && (
        <Modal
          movie={movies[selectedIndex]}
          onClose={closeModal}
          onPrev={showPrevious}
          onNext={showNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < movies.length - 1}
        />
      )}
    </div>
  );
}
