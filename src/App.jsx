import React from "react";
import { NavBar } from "./routes/components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";
import { BuscaminasScreen } from "./routes/BuscaminasScreen";
import { PuntajesScreen } from "./routes/PuntajesScreen";

export const App = () => {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<BuscaminasScreen></BuscaminasScreen>}></Route>
        <Route path="/Buscaminas" element={<BuscaminasScreen></BuscaminasScreen>}></Route>
        <Route path="/Puntajes" element={<PuntajesScreen></PuntajesScreen>}></Route>
        <Route path="/*" element={<Navigate to="/"></Navigate>}></Route>
      </Routes>
    </>
  );
};
