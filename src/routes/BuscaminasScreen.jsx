import React, { useState, useEffect, useRef } from "react";
import "../styles/buscaminas.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb, faFlag } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

export const BuscaminasScreen = () => {
  const rows = 10;
  const cols = 10;
  const minesCount = 1;
  const [cells, setCells] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    createBoard();
    return () => clearInterval(timerRef.current);
  }, []);

  const createBoard = () => {
    const mines = Array(minesCount).fill("mine").concat(Array(rows * cols - minesCount).fill(""));
    mines.sort(() => Math.random() - 0.5);

    const newCells = mines.map((mine, i) => ({
      id: i,
      mine,
      revealed: false,
      flagged: false,
      adjacentMines: 0,
    }));

    setCells(newCells);
    setGameOver(false);
    setTimer(0);
    setGameStarted(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
  };

  const handleCellClick = (cellIndex, event) => {
    if (gameOver) return;

    if (event.type === 'contextmenu') {
      event.preventDefault();
      const newCells = [...cells];
      const cell = newCells[cellIndex];
      if (!cell.revealed) {
        cell.flagged = !cell.flagged;
        setCells(newCells);
      }
      return;
    }

    if (!gameStarted) {
      startTimer();
      setGameStarted(true);
    }

    const newCells = [...cells];
    const cell = newCells[cellIndex];

    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;

    if (cell.mine === "mine") {
      setCells(newCells);

      setTimeout(() => {
        setGameOver(true);
        clearInterval(timerRef.current);
        Swal.fire({
          title: '¡Perdiste!',
          icon: 'error',
          confirmButtonText: 'Reiniciar',
          backdrop: true
        }).then(() => {
          revealAll(newCells);
        });
      }, 100);
    } else {
      const minesAround = countMinesAround(cellIndex);
      cell.adjacentMines = minesAround;

      if (minesAround === 0) {
        revealAdjacentCells(cellIndex, newCells);
      }

      setCells(newCells);

      checkForWin(newCells);
    }
  };

  const countMinesAround = (index) => {
    const x = index % cols;
    const y = Math.floor(index / cols);
    let count = 0;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const newX = x + i;
        const newY = y + j;

        if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
          const newIndex = newY * cols + newX;
          if (cells[newIndex].mine === "mine") {
            count++;
          }
        }
      }
    }

    return count;
  };

  const revealAdjacentCells = (index, newCells) => {
    const x = index % cols;
    const y = Math.floor(index / cols);

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const newX = x + i;
        const newY = y + j;

        if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
          const newIndex = newY * cols + newX;
          const adjacentCell = newCells[newIndex];

          if (!adjacentCell.revealed && !adjacentCell.flagged) {
            handleCellClick(newIndex, { type: 'leftclick' });
          }
        }
      }
    }
  };

  const revealAll = (newCells) => {
    const updatedCells = newCells.map(cell => ({
      ...cell,
      revealed: true,
    }));
    setCells(updatedCells);
  };

  const checkForWin = (newCells) => {
    const revealedCells = newCells.filter(cell => cell.revealed).length;
    const flaggedMines = newCells.filter(cell => cell.flagged && cell.mine === "mine").length;
    const nonMineCells = rows * cols - minesCount;
  
    if (revealedCells === nonMineCells) {
      setTimeout(() => {
        clearInterval(timerRef.current);
  
        Swal.fire({
          title: '¡Ganaste!',
          input: 'text',
          inputLabel: 'Ingresa tu nombre',
          inputPlaceholder: 'Nombre',
          confirmButtonText: 'Enviar',
          showCancelButton: false,
          backdrop: true
        }).then((result) => {
          if (result.value) {
            const name = result.value;
            const time = timer.toString(); // Convertir el tiempo a cadena
  
            // Reemplaza 'YOUR_API_TOKEN' con el token real si es necesario
            fetch('https://66c4bb2ab026f3cc6cf07e62.mockapi.io/ganadores', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer YOUR_API_TOKEN' // Incluye el token si es necesario
              },
              body: JSON.stringify({ name, time }), // El cuerpo debe ser un JSON válido
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Red o error de servidor');
                }
                return response.json();
              })
              .then(data => {
                console.log('Datos enviados a MockAPI:', data);
                Swal.fire({
                  title: '¡Éxito!',
                  text: 'Tus datos fueron enviados correctamente.',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                });
              })
              .catch(error => {
                console.error('Error al enviar datos a MockAPI:', error);
                Swal.fire({
                  title: 'Error',
                  text: 'No se pudo enviar los datos a MockAPI.',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                });
              });
          }
        });
      }, 100);
      setGameOver(true);
      revealAll(newCells);
    }
  };
  
  
  const handleRestart = () => {
    createBoard();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="container text-center p-5 bg-light rounded shadow" data-aos="zoom-in-up">
      <div id="timer" className="mb-3">{formatTime(timer)}</div>
      <div id="game-board" className="game-board">
        {cells.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell.revealed ? "revealed" : ""} ${cell.flagged ? "flagged" : ""}`}
            onClick={(e) => handleCellClick(index, e)}
            onContextMenu={(e) => handleCellClick(index, e)} // Manejar clic derecho
          >
            {cell.revealed && cell.mine === "mine" ? (
              <FontAwesomeIcon icon={faBomb} className="mine-icon" />
            ) : (
              cell.revealed && cell.adjacentMines > 0 ? cell.adjacentMines : ""
            )}
            {cell.flagged && <FontAwesomeIcon icon={faFlag} className="flag-icon" />}
          </div>
        ))}
      </div>
      <button id="restart-btn" className="btn btn-outline-dark mt-3" onClick={handleRestart}>
        Reiniciar
      </button>
    </div>
  );
};
