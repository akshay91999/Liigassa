"use client";

import { useState, useEffect, useMemo } from "react";
import PlayersGrid from "./PlayersGrid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import LoadingPage from "@/Components/LoadingPage";

type LeanPlayer = {
  _id: string;
  fullname: string;
  dob: string;
  email?: string;
  phone?: string;
  position: string;
  place: string;
  image?: string;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<LeanPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    position: "",
    place: "",
  });

  // PDF generation loading state
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("/api/players", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch players");
        const data = await res.json();
        setPlayers(data.players || []);
      } catch (err) {
        console.error(err);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  // unique positions & places
  const positions = useMemo(() => {
    const all = players.map((p) => p.position || "");
    return [...new Set(all)].filter(Boolean);
  }, [players]);

  const places = useMemo(() => {
    const all = players.map((p) => p.place || "");
    return [...new Set(all)].filter(Boolean);
  }, [players]);

  // age helper
  const getAge = (dob?: string) => {
    if (!dob) return "-";
    const d = new Date(dob);
    if (Number.isNaN(d.getTime())) return "-";
    const diff = Date.now() - d.getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  // filtered players
  const filteredPlayers = players.filter((p) => {
    const search = filters.search.trim().toLowerCase();
    const matchSearch = !search || p.fullname.toLowerCase().includes(search);
    const matchPosition = !filters.position || p.position === filters.position;
    const matchPlace = !filters.place || p.place === filters.place;
    return matchSearch && matchPosition && matchPlace;
  });

  if (loading){
    return <LoadingPage/>
  }
  // helper: convert image url to base64 data URL
  async function urlToDataUrl(url?: string): Promise<string | null> {
    if (!url) return null;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("Failed to fetch/convert image:", url, err);
      return null;
    }
  }

 const handleDownloadPDF = async () => {
  if (filteredPlayers.length === 0) {
    alert("No players to export.");
    return;
  }

  setPdfLoading(true);
  try {
    const imagesBase64: (string | null)[] = await Promise.all(
      filteredPlayers.map((p) => urlToDataUrl(p.image))
    );

    const imageElements = await Promise.all(
      imagesBase64.map((dataUrl): Promise<HTMLImageElement | null> => {
        if (!dataUrl) return Promise.resolve(null);
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = dataUrl;
        });
      })
    );

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Draw border
    doc.setDrawColor(169, 10, 24);
    doc.setLineWidth(3);
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

    // Logo
    try {
      const logoUrl = "/logo.png"; 
      const logoRes = await fetch(logoUrl);
      if (logoRes.ok) {
        const blob = await logoRes.blob();
        const reader = new FileReader();
        const logoBase64: string = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        doc.addImage(logoBase64, "PNG", pageWidth / 2 - 25, 30, 50, 50);
      }
    } catch (e) {}

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(169, 10, 24);
    doc.text("Liigassa Player List", pageWidth / 2, 110, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(120);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 40, 140);

    const body = filteredPlayers.map((p) => [
      "", 
      p.fullname,
      p.position,
      p.place,
      String(getAge(p.dob)),
    ]);

    autoTable(doc, {
      startY: 160,
      head: [["Photo", "Player Name", "Position", "Place", "Age"]],
      body,
      styles: {
        fontSize: 11,
        cellPadding: 6,
        valign: "middle",
      },
      headStyles: {
        fillColor: [169, 10, 24],
        textColor: [255, 255, 255],
        halign: "center",
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 80 }, // wider column for bigger image
        1: { cellWidth: 180 },
        2: { cellWidth: 100 },
        3: { cellWidth: 100 },
        4: { cellWidth: 50, halign: "center" },
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 0) {
          const rowIndex = data.row.index;
          const imgEl = imageElements[rowIndex];
          const imgData = imagesBase64[rowIndex];

          if (imgEl && imgData) {
            try {
              const { cell } = data;
              const paddingX = 4;
              const paddingY = 4;
              const maxW = cell.width - paddingX * 2;
              const maxH = cell.height - paddingY * 2;

              const iw = imgEl.naturalWidth || imgEl.width;
              const ih = imgEl.naturalHeight || imgEl.height;

              const scale = Math.min(maxW / iw, maxH / ih, 1);
              const drawW = iw * scale;
              const drawH = ih * scale;

              const x = cell.x + (cell.width - drawW) / 2;
              const y = cell.y + (cell.height - drawH) / 2;

              doc.addImage(imgData, x, y, drawW, drawH);
            } catch (err) {}
          }
        }
      },
      margin: { left: 36, right: 36 },
      rowPageBreak: 'avoid',
    });

    doc.save("liigassa_players.pdf");
  } catch (err) {
    console.error("Failed to create PDF:", err);
    alert("Failed to generate PDF. Check console for details.");
  } finally {
    setPdfLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b2040] via-[#111827] to-[#a90a18] px-4 pt-28 pb-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#a90a18] to-[#fff8db] bg-clip-text text-transparent mb-10">
        Players
      </h1>

      {/* 🔍 Search + Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center w-full md:w-auto">
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
  className="px-4 py-2 w-full md:w-52 rounded-xl bg-[#0b2040]/60 backdrop-blur-md text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#a90a18] focus:border-transparent transition appearance-none"
>
  <option value="">All Positions</option>
  {positions.map((pos) => (
    <option
      key={pos}
      value={pos}
      className="bg-[#0b2040] text-white"
    >
      {pos}
    </option>
  ))}
</select>

<select
  value={filters.place}
  onChange={(e) => setFilters({ ...filters, place: e.target.value })}
  className="px-4 py-2 w-full md:w-52 rounded-xl bg-[#0b2040]/60 backdrop-blur-md text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#a90a18] focus:border-transparent transition appearance-none"
>
  <option value="">All Places</option>
  {places.map((pl) => (
    <option
      key={pl}
      value={pl}
      className="bg-[#0b2040] text-white"
    >
      {pl}
    </option>
  ))}
</select>
      </div>

      {/* Action row: Download PDF */}
      <div className="flex justify-center mb-8 gap-3">
        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading || filteredPlayers.length === 0}
          className={`px-6 py-2 rounded-xl font-semibold shadow-md transition ${
            pdfLoading
              ? "bg-gray-600 cursor-wait text-white"
              : "bg-[#a90a18] hover:bg-[#d21c29] text-white"
          }`}
        >
          {pdfLoading ? "Generating PDF..." : `Download PDF (${filteredPlayers.length})`}
        </button>

        {/* optional: quick reset filters */}
        <button
          onClick={() => setFilters({ search: "", position: "", place: "" })}
          className="px-4 py-2 rounded-xl bg-white/8 text-white border border-white/20"
        >
          Reset Filters
        </button>
      </div>

      {/* Players grid */}
      {filteredPlayers.length === 0 ? (
        <p className="text-center text-gray-300">No players match your criteria.</p>
      ) : (
        <PlayersGrid players={filteredPlayers} />
      )}

    </div>
  );
}
