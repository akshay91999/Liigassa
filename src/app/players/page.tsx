"use client";

import { useState, useEffect, useMemo } from "react";
import PlayersGrid from "./PlayersGrid";

type LeanPlayer = {
  _id: string;
  fullname: string;
  dob: string;
  email: string;
  phone: string;
  position: string;
  place: string;
  image: string;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<LeanPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    position: "",
    place: "",
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("/api/players", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch players");
        const data = await res.json();
        setPlayers(data.players);
      } catch (err) {
        console.error(err);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const positions = useMemo(
    () => [...new Set(players.map((p) => p.position))],
    [players]
  );

  const places = useMemo(
    () => [...new Set(players.map((p) => p.place))],
    [players]
  );

  const filteredPlayers = players.filter((p) => {
    const matchSearch = p.fullname
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchPosition = !filters.position || p.position === filters.position;
    const matchPlace = !filters.place || p.place === filters.place;
    return matchSearch && matchPosition && matchPlace;
  });

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-300">Loading players...</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b2040] via-[#111827] to-[#a90a18] px-4 pt-28 pb-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#a90a18] to-[#fff8db] bg-clip-text text-transparent mb-10">
        Players
      </h1>

      {/* 🔍 Search + Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center w-full md:w-auto">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="px-4 py-2 w-full md:w-64 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#a90a18] focus:border-transparent transition"
        />

        {/* Position Dropdown */}
        <select
          value={filters.position}
          onChange={(e) => setFilters({ ...filters, position: e.target.value })}
          className="dark-select px-4 py-2 w-full md:w-52 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#a90a18] focus:border-transparent transition appearance-none"
        >
          <option value="">All Positions</option>
          {positions.map((pos) => (
            <option key={pos} value={pos} className="bg-[#0b2040] text-white">
              {pos}
            </option>
          ))}
        </select>

        {/* Place Dropdown */}
        <select
          value={filters.place}
          onChange={(e) => setFilters({ ...filters, place: e.target.value })}
          className="dark-select px-4 py-2 w-full md:w-52 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#a90a18] focus:border-transparent transition appearance-none"
        >
          <option value="">All Places</option>
          {places.map((pl) => (
            <option key={pl} value={pl} className="bg-[#0b2040] text-white">
              {pl}
            </option>
          ))}
        </select>
      </div>

      {/* Player Grid */}
      {filteredPlayers.length === 0 ? (
        <p className="text-center text-gray-300">
          No players match your criteria.
        </p>
      ) : (
        <PlayersGrid players={filteredPlayers} />
      )}

      {/* Custom Dropdown Styling */}
      <style jsx>{`
        select.dark-select option {
          background-color: #0b2040;
          color: #fff;
        }
        select.dark-select {
          background-image: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.1)
          );
        }
      `}</style>
    </div>
  );
}
