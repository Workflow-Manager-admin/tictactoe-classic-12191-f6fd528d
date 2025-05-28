"use client";

import { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Main Container for TicTacToe Classic (Next.js Page)
 * - Two player mode: X and O take turns on the 3x3 grid.
 * - Win/draw detection.
 * - Turn indicator, centered grid, reset button.
 * Theme: primary #fff, secondary #000, accent #2196f3, light layout.
 */
export default function TicTacToeClassic() {
  // Initialize 3x3 grid with nulls
  const emptyBoard = () => Array(3).fill(null).map(() => Array(3).fill(null));
  const [board, setBoard] = useState(emptyBoard());
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState(null); // "X wins!", "O wins!", "Draw", or null

  // Helper: checks for win/draw
  const calculateStatus = (board) => {
    const flat = board.flat();
    // All win lines (rows, cols, diagonals)
    const lines = [
      // Rows
      [ [0,0], [0,1], [0,2] ],
      [ [1,0], [1,1], [1,2] ],
      [ [2,0], [2,1], [2,2] ],
      // Columns
      [ [0,0], [1,0], [2,0] ],
      [ [0,1], [1,1], [2,1] ],
      [ [0,2], [1,2], [2,2] ],
      // Diagonals
      [ [0,0], [1,1], [2,2] ],
      [ [0,2], [1,1], [2,0] ],
    ];
    for (const line of lines) {
      const [a,b,c] = line;
      const v = board[a[0]][a[1]];
      if (v && v === board[b[0]][b[1]] && v === board[c[0]][c[1]]) {
        return `${v} wins!`;
      }
    }
    // Draw (all filled, no win)
    if (flat.every(cell => cell)) {
      return "Draw";
    }
    return null;
  };

  // Handle click on cell
  const handleCellClick = (row, col) => {
    if (board[row][col] || status) return; // Ignore if filled or finished
    const newBoard = board.map((r, rIdx) => r.map((cell, cIdx) =>
      (rIdx === row && cIdx === col) ? (xIsNext ? "X" : "O") : cell
    ));
    setBoard(newBoard);
    const outcome = calculateStatus(newBoard);
    setStatus(outcome);
    setXIsNext(x => outcome ? x : !x);
  };

  // Reset game
  const resetGame = () => {
    setBoard(emptyBoard());
    setXIsNext(true);
    setStatus(null);
  };

  // Theme colors
  const colors = {
    primary: "#ffffff",
    secondary: "#000000",
    accent: "#2196f3",
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-[var(--background)]"
      style={{ backgroundColor: colors.primary, color: colors.secondary }}
    >
      <div
        className="flex flex-col items-center justify-center shadow-md px-6 py-8 rounded-lg"
        style={{
          background: "#fff",
          minWidth: 320,
          minHeight: 480,
          border: `1px solid #eee`,
        }}
      >
        {/* Player Turn Indicator */}
        <div
          data-testid="turn-indicator"
          className="mb-8 text-lg sm:text-xl font-semibold"
        >
          {!status ? (
            <span>
              Turn:{" "}
              <span
                style={{
                  color: colors.accent,
                  fontWeight: 700,
                }}
              >
                {xIsNext ? "X" : "O"}
              </span>
            </span>
          ) : (
            <span
              className={`font-bold ${
                status === "Draw"
                  ? "text-gray-600"
                  : "text-[var(--color-win)]"
              }`}
              style={{
                color:
                  status === "Draw"
                    ? "#888"
                    : colors.accent,
              }}
            >
              {status}
            </span>
          )}
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-3 grid-rows-3 gap-3"
          style={{ marginBottom: "2.5rem" }}
          data-testid="tictactoe-board"
        >
          {board.map((rowArr, row) =>
            rowArr.map((cell, col) => (
              <button
                key={`${row}-${col}`}
                type="button"
                data-testid={`cell-${row}-${col}`}
                aria-label={`Cell ${row} ${col}`}
                onClick={() => handleCellClick(row, col)}
                className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-3xl sm:text-4xl border border-gray-200 rounded-md font-bold shadow hover:shadow-lg transition-all focus:outline-none bg-[var(--background)]"
                style={{
                  backgroundColor: cell
                    ? "#f9f9f9"
                    : "#fff",
                  color: cell === "X" ? colors.accent : ""
                }}
                disabled={!!cell || !!status}
              >
                {cell}
              </button>
            ))
          )}
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={resetGame}
          className="mt-2 px-6 py-2 rounded-full bg-[#2196f3] text-white font-semibold shadow hover:bg-[#1c7cd6] transition"
          style={{
            backgroundColor: colors.accent,
          }}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}
