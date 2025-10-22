import React, { useState } from "react";
import MovieList from "./MovieList";
import Modal from "./Modal";

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [movies, setMovies] = useState([]); // algväärtus on alati tühi massiiv

  const openModal = (movie, index) => {
    setSelectedMovie(movie || null);
    setModalIndex(index ?? 0);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const showPrevious = () => {
    if (Array.isArray(movies) && modalIndex > 0) {
      const newIndex = modalIndex - 1;
      setModalIndex(newIndex);
      setSelectedMovie(movies[newIndex]);
    }
  };

  const showNext = () => {
    if (Array.isArray(movies) && modalIndex < movies.length - 1) {
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

      {/* MovieList vastutab andmete laadimise eest */}
      <MovieList onOpenModal={openModal} setMovies={setMovies} />

      {/* Modal avaneb ainult siis, kui film on valitud */}
      {selectedMovie && Array.isArray(movies) && (
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
