// components/game/AttackMenu.jsx
"use client";

export default function AttackMenu({ moves, onSelect }) {
  return (
    <div className="flex gap-2">
      {moves.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}       // usa onSelect, não doAttack
          className="px-4 w-60 h-10 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {m.name}
        </button>
      ))}
    </div>
  );
}
