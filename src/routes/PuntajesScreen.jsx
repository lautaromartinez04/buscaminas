import React, { useState, useEffect } from 'react';
import "../styles/puntaje.css"; // Asegúrate de tener este archivo para los estilos

const formatTime = (timeString) => {
  // Asume que `timeString` está en segundos como una cadena
  const milliseconds = parseFloat(timeString) * 1000; // Convertir segundos a milisegundos
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const ms = Math.floor(milliseconds % 1000); // Obtener milisegundos
  
  // Asegurarse de que los minutos, segundos y milisegundos tengan el formato adecuado
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(ms).padStart(3, '0')}`;
};

export const PuntajesScreen = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Reemplaza la URL con la de tu MockAPI
    fetch('https://66c4bb2ab026f3cc6cf07e62.mockapi.io/ganadores')
      .then(response => response.json())
      .then(data => {
        const sortedData = data.sort((a, b) => parseFloat(a.time) - parseFloat(b.time)); // Ordenar por tiempo en segundos
        setScores(sortedData.slice(0, 10));
      })
      .catch(error => console.error('Error al cargar los puntajes:', error));
  }, []);

  const topThree = scores.slice(0, 3);
  const remainingScores = scores.slice(3);

  return (
    <div className='container text-center mt-5 p-5 bg-light rounded shadow' data-aos="zoom-in-up">
      <h1>TOP 10</h1>
      <div className='podium-container'>
        <div className='podium-item first'>{topThree[0] && (
          <div className='podium-item-content'>
            <h2>1</h2>
            <p>{topThree[0].name}</p>
            <p>{formatTime(topThree[0].time)}</p>
          </div>
        )}</div>
        <div className='podium-item second'>{topThree[1] && (
          <div className='podium-item-content'>
            <h2>2</h2>
            <p>{topThree[1].name}</p>
            <p>{formatTime(topThree[1].time)}</p>
          </div>
        )}</div>
        <div className='podium-item third'>{topThree[2] && (
          <div className='podium-item-content'>
            <h2>3</h2>
            <p>{topThree[2].name}</p>
            <p>{formatTime(topThree[2].time)}</p>
          </div>
        )}</div>
      </div>
      <table className='scoreboard-table mt-4'>
        <thead>
          <tr>
            <th>Posición</th>
            <th>Nombre</th>
            <th>Tiempo</th>
          </tr>
        </thead>
        <tbody>
          {remainingScores.map((score, index) => (
            <tr key={index}>
              <td>{index + 4}</td> {/* Posición, empezando desde 4 */}
              <td>{score.name}</td>
              <td>{formatTime(score.time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
