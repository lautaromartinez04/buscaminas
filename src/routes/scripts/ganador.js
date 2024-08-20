const checkForWin = () => {
    const revealedCells = cells.filter(cell => cell.revealed).length;
    const nonMineCells = rows * cols - minesCount;
  
    if (revealedCells === nonMineCells) {
      setTimeout(() => {
        alert("¡Ganaste!");
      }, 100);
    }
  };
  
  // Llama a `checkForWin` dentro de `handleCellClick` después de manejar una celda no mina
  if (cell.mine !== "mine") {
    checkForWin();
  }
  