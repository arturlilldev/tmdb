import React, { useState } from "react";
import MovieList from "./MovieList";
import Modal from "./Modal";

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [movies, setMovies] = useState([]);

  // Avab modali ja salvestab indeksi
  const openModal = (movie, index) => {
    setSelectedMovie(movie);
    setModalIndex(index);
  };

  // Sulgeb modali
  const closeModal = () => {
    setSelectedMovie(null);
  };

  // Liikumine eelmisele/ järgmisele filmile
  const showPrevious = () => {
    if (modalIndex > 0) {
      const newIndex = modalIndex - 1;
      setModalIndex(newIndex);
      setSelectedMovie(movies[newIndex]);
    }
  };

  const showNext = () => {
    if (modalIndex < movies.length - 1) {
      const newIndex = modalIndex + 1;
      setModalIndex(newIndex);
      setSelectedMovie(movies[newIndex]);
    }
  };

  return (
    <div className="app-container" style={{ textAlign: "center", padding: "20px" }}>
      <h2>
        Sisesta otsitava pealkirja algus (vähemalt 3 tähemärki):
      </h2>

      {/* MovieList vastutab otsingute ja andmete toomise eest */}
      <MovieList onOpenModal={openModal} setMovies={setMovies} />

      {/* Modal avaneb, kui film on valitud */}
      {selectedMovie && (
        <Modal
          movie={selectedMovie}
          onClose={closeModal}
          onPrev={showPrevious}
          onNext={showNext}
          hasPrev={modalIndex > 0}
          hasNext={modalIndex < movies.length - 1}
        />
      )}
    </div>
  );
}

export default App;
