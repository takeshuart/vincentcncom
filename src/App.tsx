// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VincentAdmin from './pages/VincentAdmin';
import VincentImages from './pages/VincentGrid';
import ArtworkDetailPage from './pages/VincentArtworkDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VincentAdmin />} />
        <Route path="/vincent" element={<VincentImages />} />
        <Route path="/vincent/id/:id" element={<ArtworkDetailPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
