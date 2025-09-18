import React from 'react'

function HomePage() {
  return (
   <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        
        muted
        playsInline
        className="absolute top-1/2 left-1/2 h-auto min-h-full w-auto min-w-full 
                   object-cover -translate-x-1/2 -translate-y-1/2 rotate-270"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">
          Welcome to <span className="text-[#a90a18]">Ligassa</span>
        </h1>
        <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-md">
          Experience the ultimate football league with teams, players, and passion like never before.
        </p>
        <button className="mt-8 px-6 py-3 bg-gradient-to-r from-[#0b2040] to-[#a90a18] text-white font-semibold rounded-lg shadow-lg hover:from-[#a90a18] hover:to-[#0b2040] transition-all">
          Get Started
        </button>
      </div>
    </section>
  )
}

export default HomePage
