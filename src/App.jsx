import React, { useState } from "react";
import MovieList from "./MovieList";
import Modal from "./Modal";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = (index) => {
    if (!Array.isArray(movies) || index == null) return;
    if (index < 0 || index >= movies.length) return;
    setSelectedIndex(index);
  };

  const closeModal = () => setSelectedIndex(null);

  const showPrevious = () => {
    if (selectedIndex > 0) setSelectedIndex((i) => i - 1);
  };

  const showNext = () => {
    if (selectedIndex < movies.length - 1) setSelectedIndex((i) => i + 1);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1>Filmiotsing</h1>
      <MovieList setMovies={setMovies} onOpenModal={openModal} />
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
