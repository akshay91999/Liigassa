"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Photo = {
  id: number;
  src: string;
  title: string;
};

// Generate 19 photos dynamically
const photos: Photo[] = Array.from({ length: 19 }, (_, i) => ({
  id: i + 1,
  src: `/previousseason/prevseason${i + 1}.jpeg`,
  title: `Photo ${i + 1}`,
}));

export default function FunGallery() {
  const [selected, setSelected] = useState<Photo | null>(null);
  const [positions, setPositions] = useState<
    { top: number; left: number; rotate: number }[]
  >([]);

  const rows = 5;
  const cols = Math.ceil(photos.length / rows);

  // Generate random positions on client only
  useEffect(() => {
    const newPositions = photos.map((_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const rowHeight = 100 / rows;
      const colWidth = 100 / cols;

      return {
        top: row * rowHeight + Math.random() * (rowHeight - 10),
        left: col * colWidth + Math.random() * (colWidth - 10),
        rotate: Math.random() * 10 - 5,
      };
    });
    setPositions(newPositions);
  }, []);

  return (
    <section className="relative py-20 bg-gradient-to-tr from-[#0b2040] via-[#111827] to-[#a90a18] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold mb-12"
        >
          <span className="bg-gradient-to-r from-[#fff8db] to-[#a90a18] bg-clip-text text-transparent">
            Previous Season Memories
          </span>
        </motion.h2>

        <div className="relative w-full h-[90vh] md:h-[100vh]">
          {positions.length > 0 &&
            photos.map((photo, index) => {
              const { top, left, rotate } = positions[index];

              return (
                <motion.div
                  key={photo.id}
                  style={{ top: `${top}%`, left: `${left}%`, zIndex: index }}
                  initial={{ opacity: 0, scale: 0.85, rotate }}
                  animate={{
                    opacity: 1,
                    scale: [1, 1.05, 1],
                    rotate: [rotate, rotate + 2, rotate],
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 6 + Math.random() * 2,
                    delay: index * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute w-40 md:w-56 cursor-pointer rounded-2xl shadow-2xl overflow-hidden hover:scale-110 hover:rotate-0 transition-transform"
                  onClick={() => setSelected(photo)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    width={224}
                    height={224}
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl max-w-4xl w-full p-4 relative shadow-2xl flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-50 text-white text-3xl hover:text-red-400 transition"
              >
                ✕
              </button>

              <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
                <Image
                  src={selected.src}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
