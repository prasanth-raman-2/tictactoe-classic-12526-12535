import React from "react";

// PUBLIC_INTERFACE
export default function Board({ board, onMove, disabled }) {
  /** Tic Tac Toe 3x3 grid. 
   * @param board: List[List["X"|"O"|null]]; onMove: func(x, y); disabled: bool
   */
  return (
    <div
      style={{
        width: 270, height: 270,
        margin: "auto",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gap: 4,
        background: "var(--border-color)"
      }}
    >
      {[0,1,2].flatMap(x => [0,1,2].map(y =>
        <Cell
          key={x*3+y}
          x={x}
          y={y}
          value={board?.[x]?.[y]}
          onClick={onMove}
          disabled={disabled || board?.[x]?.[y] != null}
        />
      ))}
    </div>
  );
}

function Cell({x, y, value, onClick, disabled}) {
  const cellStyle = {
    width: 80,
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 40,
    cursor: disabled ? "not-allowed" : "pointer",
    background: "var(--bg-secondary)",
    border: "2px solid var(--border-color)",
    borderRadius: 12,
    color: value === "X" ? "#E87A41" : value === "O" ? "#3f51b5" : "#333",
    fontWeight: "bold"
  };

  return (
    <div
      role="button"
      aria-label={`Cell ${x+1},${y+1}` + (value ? `, ${value}` : "")}
      tabIndex={disabled ? -1 : 0}
      style={cellStyle}
      onClick={() => !disabled && onClick && onClick(x, y)}
      onKeyDown={e => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) onClick(x, y);
      }}
    >
      {value || ""}
    </div>
  );
}
