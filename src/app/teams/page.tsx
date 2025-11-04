import { teamsData } from "@/Components/DataStore";
import Image from "next/image";

export default function TeamsPage() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-[#0b2040] via-[#111827] to-[#a90a18] text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-wide mb-6">
          <span className="bg-gradient-to-r from-[#fff8db] to-[#a90a18] bg-clip-text text-transparent">
            Meet the Teams
          </span>
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          8 powerful teams battle it out in <span className="font-bold text-[#a90a18]">Liigassa Season 2</span>.
          Every logo carries passion, strength, and the spirit of football.
        </p>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {teamsData.map((item, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl 
              transform transition duration-500 hover:scale-110 hover:bg-gradient-to-r hover:from-[#a90a18] hover:to-[#0b2040]"
            >
              <div className="mx-auto relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:rotate-12"
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                />
              </div>

              <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-wide">
                {item.name}
              </p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
